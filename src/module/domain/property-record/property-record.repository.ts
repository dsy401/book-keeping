import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '../../global/database/database.repository';
import { PropertyRecord } from './property-record';
import {
  CreateTableCommandInput,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { InternalConfigService } from '../../global/config/internal-config.service';
import { InternalException } from '../../../exception/internal-exception';
import { UUID } from '../../../types/uuid.type';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PropertyRecordRepository extends DatabaseRepository<PropertyRecord> {
  constructor(client: DynamoDBClient, config: InternalConfigService) {
    super(config.getDatabaseConfig().propertyRecordTableName, client);
  }

  public async save(propertyRecord: PropertyRecord): Promise<PropertyRecord> {
    try {
      return await this.putItem(propertyRecord);
    } catch (error) {
      throw new InternalException(
        'PROPERTY_RECORD.FAILED_TO_SAVE',
        error.message,
      );
    }
  }

  public async delete(propertyRecordId: UUID, userId: UUID): Promise<void> {
    try {
      await this.deleteItem({ propertyRecordId, userId });
    } catch (error) {
      throw new InternalException(
        'PROPERTY_RECORD.FAILED_TO_DELETE',
        error.message,
      );
    }
  }

  public async getByPropertyId(
    propertyId: UUID,
    userId: UUID,
  ): Promise<PropertyRecord[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'userIdCategoryIdIndex',
      ExpressionAttributeValues: marshall({
        ':userId': userId,
        ':propertyId': propertyId,
      }),
      KeyConditionExpression: 'userId = :userId AND propertyId= :propertyId',
    });

    try {
      const { Items } = await this.client.send(command);
      return Items.map((item) =>
        plainToClass(PropertyRecord, unmarshall(item)),
      );
    } catch (error) {
      throw new InternalException(
        'PROPERTY_RECORD.FAILED_TO_GET',
        error.message,
      );
    }
  }

  protected getTableDefinition(): CreateTableCommandInput {
    return {
      TableName: this.tableName,
      AttributeDefinitions: [
        {
          AttributeName: 'propertyRecordId',
          AttributeType: 'S',
        },
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
          AttributeName: 'propertyRecordId',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'userId',
          KeyType: 'RANGE',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userIdPropertyIdIndex',
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'propertyId',
              KeyType: 'RANGE',
            },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };
  }
}
