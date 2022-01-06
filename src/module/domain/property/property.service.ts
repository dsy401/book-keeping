import { Injectable } from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { Property } from './property';
import type { UUID } from '../../../types/uuid.type';
import { InternalException } from "../../../exception/internal-exception";

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  public async save(property: Property): Promise<void> {
    await this.propertyRepository.save(property);
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
}
