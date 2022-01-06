import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '../../global/database/database.repository';
import { Property } from './property';
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
import { Transaction } from '../transaction/transaction';

@Injectable()
export class PropertyRepository extends DatabaseRepository<Property> {
  constructor(client: DynamoDBClient, config: InternalConfigService) {
    super(config.getDatabaseConfig().propertyTableName, client);
  }

  public async save(property: Property): Promise<Property> {
    try {
      return await this.putItem(property);
    } catch (error) {
      throw new InternalException('PROPERTY.FAILED_TO_SAVE', error.message);
    }
  }

  public async getByPropertyId(
    propertyId: UUID,
    userId: UUID,
  ): Promise<Property | undefined> {
    try {
      return await this.getItem({ propertyId, userId }, Property);
    } catch (error) {
      throw new InternalException('PROPERTY.FAILED_TO_GET', error.message);
    }
  }

  public async delete(propertyId: UUID, userId: UUID): Promise<void> {
    try {
      await this.deleteItem({ propertyId, userId });
    } catch (error) {
      throw new InternalException('PROPERTY.FAILED_TO_DELETE', error.message);
    }
  }

  public async getByUserId(userId: UUID): Promise<Property[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'userIdIndex',
      ExpressionAttributeValues: marshall({
        ':userId': userId,
      }),
      KeyConditionExpression: 'userId = :userId',
    });

    try {
      const { Items } = await this.client.send(command);
      return Items.map((item) => plainToClass(Property, unmarshall(item)));
    } catch (error) {
      throw new InternalException('PROPERTY.FAILED_TO_GET', error.message);
    }
  }

  protected getTableDefinition(): CreateTableCommandInput {
    return {
      TableName: this.tableName,
      AttributeDefinitions: [
        {
          AttributeName: 'propertyId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'propertyId',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'userId',
          KeyType: 'RANGE',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userIdIndex',
          KeySchema: [
            {
              AttributeName: 'userId',
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
