import type { UUID } from '../../../types/uuid.type';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { Type } from 'class-transformer';
import { DynamoTimestampTransformer } from '../../../utils/transformer/dynamo-date-transformer';

export class User {
  public readonly userId: UUID;

  public readonly email: string;

  public password: string;

  public firstName: string;

  public lastName: string;

  public displayName: string;

  public gender: boolean;

  public timezone: string;

  @Type(() => Number)
  @DynamoTimestampTransformer()
  public readonly createdAt: DateTime;

  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: boolean,
    timezone: string,
    displayName?: string,
  ) {
    this.userId = uuid();
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.timezone = timezone;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName ?? firstName;
    this.createdAt = DateTime.now();
  }
}
