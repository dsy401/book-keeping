import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '../../global/database/database.repository';
import { TransactionCategory } from './transaction-category';
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
export class TransactionCategoryRepository extends DatabaseRepository<TransactionCategory> {
  constructor(client: DynamoDBClient, config: InternalConfigService) {
    super(config.getDatabaseConfig().transactionCategoryTableName, client);
  }

  public async save(
    category: TransactionCategory,
  ): Promise<TransactionCategory> {
    try {
      return await this.putItem(category);
    } catch (error) {
      throw new InternalException(
        'TRANSACTION_CATEGORY.FAILED_TO_SAVE',
        error.message,
      );
    }
  }

  public async delete(categoryId: UUID, userId: UUID): Promise<void> {
    try {
      await this.deleteItem({ categoryId, userId });
    } catch (error) {
      throw new InternalException(
        'TRANSACTION_CATEGORY.FAILED_TO_DELETE',
        error.message,
      );
    }
  }

  public async getByCategoryId(
    categoryId: UUID,
    userId: UUID,
  ): Promise<TransactionCategory | undefined> {
    try {
      return await this.getItem({ categoryId, userId }, TransactionCategory);
    } catch (error) {
      throw new InternalException(
        'TRANSACTION_CATEGORY.FAILED_TO_GET',
        error.message,
      );
    }
  }

  public async getByUserId(userId: UUID): Promise<TransactionCategory[]> {
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
      return Items.map((item) =>
        plainToClass(TransactionCategory, unmarshall(item)),
      );
    } catch (error) {
      throw new InternalException(
        'TRANSACTION_CATEGORY.FAILED_TO_GET',
        error.message,
      );
    }
  }

  protected getTableDefinition(): CreateTableCommandInput {
    return {
      TableName: this.tableName,
      AttributeDefinitions: [
        {
          AttributeName: 'categoryId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'categoryId',
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
