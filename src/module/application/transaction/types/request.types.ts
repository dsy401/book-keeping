import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import type { UUID } from '../../../../types/uuid.type';

export class TransactionIdParams {
  @IsUUID()
  transactionId!: UUID;
}

export class CreateTransactionRequestDto {
  @IsUUID()
  categoryId!: UUID;

  @IsString()
  note!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  transactionDate!: string;
}

export class GetByDateRangeRequestDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}

enum PartialUpdateField {
  CATEGORY_ID = 'categoryId',
  NOTE = 'note',
  AMOUNT = 'amount',
}

export class PartialUpdateRequestDto {
  @IsEnum(PartialUpdateField)
  name!: PartialUpdateField;

  @IsDefined()
  value!: any;
}
