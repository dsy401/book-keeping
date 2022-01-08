import type { UUID } from '../../../types/uuid.type';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { DynamoTimestampTransformer } from '../../../utils/transformer/dynamo-date-transformer';
import { Property } from '../property/property';
import { DynamoClassTransformer } from '../../../utils/transformer/dynamo-class-transformer';
import { v4 as uuid } from 'uuid';

/**
 * Record updated property
 */
export class PropertyRecord {
  public propertyRecordId: UUID;

  public propertyId: UUID;

  public userId: UUID;

  @DynamoClassTransformer<Property>(Property)
  public property: Property;

  @Type(() => Number)
  @DynamoTimestampTransformer()
  public createdAt: DateTime;

  constructor(propertyId: UUID, userId: UUID) {
    this.propertyRecordId = uuid();
    this.propertyId = propertyId;
    this.userId = userId;
    this.createdAt = DateTime.now();
  }

  public setProperty(property: Property): void {
    this.property = property;
  }
}
