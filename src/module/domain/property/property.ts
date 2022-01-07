import type { UUID } from '../../../types/uuid.type';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { DynamoTimestampTransformer } from '../../../utils/transformer/dynamo-date-transformer';

export enum PropertyType {
  ASSETS = 'assets',
  DEBT = 'debt',
}

export class Property {
  public readonly propertyId: UUID;

  public readonly userId: UUID;

  public readonly type: PropertyType;

  public amount: number;

  public note: string;

  public name: string;

  @Type(() => Number)
  @DynamoTimestampTransformer()
  public readonly createdAt: DateTime;

  constructor(
    userId: UUID,
    type: PropertyType,
    amount: number,
    note: string,
    name: string,
  ) {
    this.propertyId = uuid();
    this.userId = userId;
    this.type = type;
    this.amount = amount;
    this.note = note;
    this.name = name;
    this.createdAt = DateTime.now();
  }

  public updateAmount(amount: number): void {
    this.amount = amount;
  }

  public update(amount: number, note: string, name: string): void {
    this.amount = amount;
    this.note = note;
    this.name = name;
  }
}
