import type { UUID } from '../../../types/uuid.type';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { DynamoTimestampTransformer } from '../../global/database/utils/dynamo-date-transformer';
import { v4 as uuid } from 'uuid';

export class Transaction {
  public readonly transactionId: UUID;

  public readonly userId: UUID;

  public categoryId: UUID;

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
}
