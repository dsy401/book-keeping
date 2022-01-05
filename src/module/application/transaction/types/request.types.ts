import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import type { UUID } from '../../../../types/uuid.type';
import { TransactionType } from '../../../domain/transaction/transaction';

export class GetByTransactionIdParams {
  @IsUUID()
  transactionId!: UUID;
}

export class DeleteTransactionParams {
  @IsUUID()
  transactionId!: UUID;
}

export class CreateTransactionRequestDto {
  @IsEnum(TransactionType)
  type!: TransactionType;

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
  startDate: string;

  @IsDateString()
  endDate: string;
}
