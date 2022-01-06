import { IsEnum, IsNumber, IsString, IsUUID } from "class-validator";
import { PropertyType } from '../../../domain/property/property';
import type { UUID } from '../../../../types/uuid.type';

export class CreatePropertyRequestDto {
  @IsEnum(PropertyType)
  type!: PropertyType;

  @IsNumber()
  amount!: number;

  @IsString()
  note!: string;

  @IsString()
  name!: string;
}

export class UpdatePropertyAmountRequestDto {
  @IsNumber()
  amount!: number;
}

export class UpdatePropertyRequestDto {
  @IsNumber()
  amount!: number;

  @IsString()
  note!: string;

  @IsString()
  name!: string;
}

export class PropertyIdParams {
  @IsUUID()
  propertyId!: UUID;
}
