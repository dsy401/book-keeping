import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '../../global/database/database.repository';
import { Transaction } from './transaction';
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
export class TransactionRepository extends DatabaseRepository<Transaction> {
  constructor(client: DynamoDBClient, config: InternalConfigService) {
    super(config.getDatabaseConfig().transactionTableName, client);
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    try {
      return await this.putItem(transaction);
    } catch (error) {
      throw new InternalException('TRANSACTION.FAILED_TO_SAVE', error.message);
    }
  }

  public async getByTransactionId(
    transactionId: UUID,
    userId: UUID,
  ): Promise<Transaction | undefined> {
    try {
      return await this.getItem({ transactionId, userId }, Transaction);
    } catch (error) {
      throw new InternalException('TRANSACTION.FAILED_TO_GET', error.message);
    }
  }

  public async delete(transactionId: UUID, userId: UUID): Promise<void> {
    try {
      await this.deleteItem({ transactionId, userId });
    } catch (error) {
      throw new InternalException(
        'TRANSACTION.FAILED_TO_DELETE',
        error.message,
      );
    }
  }

  public async getByCategoryId(
    categoryId: UUID,
    userId: UUID,
  ): Promise<Transaction[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'userIdCategoryIdIndex',
      ExpressionAttributeValues: marshall({
        ':userId': userId,
        ':categoryId': categoryId,
      }),
      KeyConditionExpression: 'userId = :userId AND categoryId= :categoryId',
    });

    try {
      const { Items } = await this.client.send(command);
      return Items.map((item) => plainToClass(Transaction, unmarshall(item)));
    } catch (error) {
      throw new InternalException('TRANSACTION.FAILED_TO_GET', error.message);
    }
  }

  public async getByDateTimeRange(
    userId: UUID,
    startDateTime: number,
    endDateTime: number,
    exclusiveStartKey: any = undefined,
    transactions: Transaction[] = [],
  ): Promise<Transaction[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'userIdTransactionDateIndex',
      Limit: 1000,
      ExpressionAttributeValues: marshall({
        ':userId': userId,
        ':startDateTime': startDateTime,
        ':endDateTime': endDateTime,
      }),
      ExclusiveStartKey: exclusiveStartKey,
      KeyConditionExpression:
        'userId = :userId AND transactionDate BETWEEN :startDateTime AND :endDateTime',
    });

    try {
      const { Items, LastEvaluatedKey } = await this.client.send(command);

      const items = Items.map((item) =>
        plainToClass(Transaction, unmarshall(item)),
      );

      if (LastEvaluatedKey) {
        return this.getByDateTimeRange(
          userId,
          startDateTime,
          endDateTime,
          LastEvaluatedKey,
          transactions.concat(items),
        );
      }

      return transactions.concat(items);
    } catch (error) {
      throw new InternalException('TRANSACTION.FAILED_TO_GET', error.message);
    }
  }

  protected getTableDefinition(): CreateTableCommandInput {
    return {
      TableName: this.tableName,
      AttributeDefinitions: [
        {
          AttributeName: 'transactionId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'transactionDate',
          AttributeType: 'N',
        },
        {
          AttributeName: 'categoryId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'transactionId',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'userId',
          KeyType: 'RANGE',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userIdTransactionDateIndex',
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'transactionDate',
              KeyType: 'RANGE',
            },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
        {
          IndexName: 'userIdCategoryIdIndex',
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'categoryId',
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
