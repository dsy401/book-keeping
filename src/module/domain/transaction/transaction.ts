import type { UUID } from '../../../types/uuid.type';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { DynamoTimestampTransformer } from '../../../utils/transformer/dynamo-date-transformer';
import { v4 as uuid } from 'uuid';
import { TransactionCategory } from '../transaction-category/transaction-category';
import { DynamoClassTransformer } from '../../../utils/transformer/dynamo-class-transformer';

export class Transaction {
  public readonly transactionId: UUID;

  public readonly userId: UUID;

  public categoryId: UUID;

  @DynamoClassTransformer<TransactionCategory>(TransactionCategory)
  public category: TransactionCategory;

  public note: string;

  public amount: number;

  @Type(() => Number)
  @DynamoTimestampTransformer()
  public readonly transactionDate: DateTime;

  @Type(() => Number)
  @DynamoTimestampTransformer()
  public readonly createdAt: DateTime;

  constructor(
    userId: UUID,
    categoryId: UUID,
    note: string,
    amount: number,
    date: DateTime,
  ) {
    this.userId = userId;
    this.transactionId = uuid();
    this.categoryId = categoryId;
    this.note = note;
    this.amount = amount;
    this.transactionDate = date;
    this.createdAt = DateTime.now();
  }

  public setCategory(category: TransactionCategory): void {
    this.category = category;
  }
}
