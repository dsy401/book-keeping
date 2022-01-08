import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { Property } from './property';
import type { UUID } from '../../../types/uuid.type';
import { InternalException } from '../../../exception/internal-exception';
import { PropertyRecordService } from '../property-record/property-record.service';
import { PropertyRecord } from '../property-record/property-record';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    @Inject(forwardRef(() => PropertyRecordService))
    private readonly propertyRecordService: PropertyRecordService,
  ) {}

  public async save(property: Property): Promise<void> {
    await this.propertyRepository.save(property);

    const propertyRecord = new PropertyRecord(
      property.propertyId,
      property.userId,
    );

    await this.propertyRecordService.save(propertyRecord);
  }

  public async getByPropertyId(
    propertyId: UUID,
    userId: UUID,
  ): Promise<Property | undefined> {
    return this.propertyRepository.getByPropertyId(propertyId, userId);
  }

  public delete(propertyId: UUID, userId: UUID): Promise<void> {
    return this.propertyRepository.delete(propertyId, userId);
  }

  public async getByUserId(userId: UUID): Promise<Property[]> {
    return this.propertyRepository.getByUserId(userId);
  }

  public async updateAmount(
    propertyId: UUID,
    userId: UUID,
    amount: number,
  ): Promise<Property> {
    const property = await this.getByPropertyId(propertyId, userId);

    if (!property) {
      throw new InternalException(
        'PROPERTY.NOT_FOUND',
        'property not found',
        HttpStatus.NOT_FOUND,
      );
    }

    property.updateAmount(amount);

    await this.save(property);

    //TODO: add logs

    return property;
  }

  public async update(
    propertyId: UUID,
    userId: UUID,
    amount: number,
    note: string,
    name: string,
  ): Promise<Property> {
    const property = await this.getByPropertyId(propertyId, userId);

    if (!property) {
      throw new InternalException('PROPERTY.NOT_FOUND', 'property not found');
    }

    property.update(amount, note, name);

    await this.save(property);

    //TODO: add logs

    return property;
  }
}
