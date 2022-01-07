import type { UUID } from '../../../types/uuid.type';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { DynamoTimestampTransformer } from '../../../utils/transformer/dynamo-date-transformer';
import { v4 as uuid } from 'uuid';

export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export class TransactionCategory {
  public readonly categoryId: UUID;

  public readonly userId: UUID;

  public readonly type: CategoryType;

  public readonly name: string;

  // icon url or icon name
  public readonly icon: string;

  @Type(() => Number)
  @DynamoTimestampTransformer()
  public readonly createdAt: DateTime;

  constructor(userId: UUID, type: CategoryType, name: string, icon: string) {
    this.categoryId = uuid();
    this.userId = userId;
    this.type = type;
    this.name = name;
    this.icon = icon;
    this.createdAt = DateTime.now();
  }
}
