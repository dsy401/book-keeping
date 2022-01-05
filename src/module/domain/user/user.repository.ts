import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '../../global/database/database.repository';
import { User } from './user';
import {
  CreateTableCommandInput,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { InternalConfigService } from '../../global/config/internal-config.service';
import { InternalException } from '../../../exception/internal-exception';
import type { UUID } from '../../../types/uuid.type';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserRepository extends DatabaseRepository<User> {
  constructor(client: DynamoDBClient, config: InternalConfigService) {
    super(config.getDatabaseConfig().userTableName, client);
  }

  public async save(user: User): Promise<User> {
    try {
      await this.putItem(user);

      return user;
    } catch (error) {
      this.logger.error(error.stack || error.message);
      throw new InternalException('USER.FAILED_TO_SAVE', error.message);
    }
  }

  public async getByUserId(userId: UUID): Promise<User | undefined> {
    try {
      return await this.getItem({ userId }, User);
    } catch (error) {
      throw new InternalException('USER.FAILED_TO_GET', error.message);
    }
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'emailIndex',
      Limit: 1,
      ExpressionAttributeValues: marshall({
        ':email': email,
      }),
      KeyConditionExpression: 'email = :email',
    });

    try {
      const { Items } = await this.client.send(command);

      if (!Items || Items.length === 0) {
        return undefined;
      } else if (Items.length > 1) {
        throw new InternalException(
          'USER.FAILED_TO_GET',
          'More than one user for the email was found',
        );
      }

      const unmarshalledItem = unmarshall(Items[0]);

      return plainToClass(User, unmarshalledItem);
    } catch (error) {
      throw new InternalException('USER.FAILED_TO_GET', error.message);
    }
  }

  protected getTableDefinition(): CreateTableCommandInput {
    return {
      TableName: this.tableName,
      AttributeDefinitions: [
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'email',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'userId',
          KeyType: 'HASH',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'emailIndex',
          KeySchema: [
            {
              AttributeName: 'email',
              KeyType: 'HASH',
            },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };
  }
}
