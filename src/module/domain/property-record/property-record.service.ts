import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PropertyRecordRepository } from './property-record.repository';
import { PropertyRecord } from './property-record';
import { PropertyService } from '../property/property.service';
import { InternalException } from '../../../exception/internal-exception';
import { UUID } from '../../../types/uuid.type';

@Injectable()
export class PropertyRecordService {
  constructor(
    private readonly propertyRecordRepository: PropertyRecordRepository,
    @Inject(forwardRef(() => PropertyService))
    private readonly propertyService: PropertyService,
  ) {}

  public async save(propertyRecord: PropertyRecord): Promise<void> {
    const property = await this.propertyService.getByPropertyId(
      propertyRecord.propertyId,
      propertyRecord.userId,
    );

    if (!property) {
      throw new InternalException(
        'PROPERTY_RECORD.FAILED_TO_SAVE',
        'property not found for propertyId',
      );
    }

    propertyRecord.setProperty(property);

    await this.propertyRecordRepository.save(propertyRecord);
  }

  public delete(propertyRecordId: UUID, userId: UUID): Promise<void> {
    return this.propertyRecordRepository.delete(propertyRecordId, userId);
  }

  public getByPropertyId(
    propertyId: UUID,
    userId: UUID,
  ): Promise<PropertyRecord[]> {
    return this.propertyRecordRepository.getByPropertyId(propertyId, userId);
  }
}
