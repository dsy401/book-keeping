import { Injectable } from '@nestjs/common';
import { PropertyService as PropertyDomainService } from '../../domain/property/property.service';
import { Property } from '../../domain/property/property';
import type { UUID } from '../../../types/uuid.type';
import { InternalException } from '../../../exception/internal-exception';
@Injectable()
export class PropertyApplicationService {
  constructor(private readonly propertyDomainService: PropertyDomainService) {}

  public async createProperty(property: Property): Promise<void> {
    await this.propertyDomainService.save(property);

    //TODO: add log
  }

  public async deleteProperty(propertyId: UUID, userId: UUID): Promise<void> {
    await this.propertyDomainService.delete(propertyId, userId);

    //TODO: delete logs
  }

  public getPropertiesByUserId(userId: UUID): Promise<Property[]> {
    return this.propertyDomainService.getByUserId(userId);
  }

  public async updatePropertyAmount(
    propertyId: UUID,
    userId: UUID,
    amount: number,
  ): Promise<Property> {
    const property = await this.propertyDomainService.getByPropertyId(
      propertyId,
      userId,
    );

    if (!property) {
      throw new InternalException('PROPERTY.NOT_FOUND', 'property not found');
    }

    property.updateAmount(amount);

    await this.propertyDomainService.save(property);

    //TODO: add logs

    return property;
  }

  public async updateProperty(
    propertyId: UUID,
    userId: UUID,
    amount: number,
    note: string,
    name: string,
  ): Promise<Property> {
    const property = await this.propertyDomainService.getByPropertyId(
      propertyId,
      userId,
    );

    if (!property) {
      throw new InternalException('PROPERTY.NOT_FOUND', 'property not found');
    }

    const hasAmountChanged = property.amount !== amount;

    property.update(amount, note, name);

    await this.propertyDomainService.save(property);

    if (hasAmountChanged) {
      //TODO: add logs
    }

    return property;
  }
}
