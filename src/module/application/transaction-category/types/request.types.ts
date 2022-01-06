import { IsEnum, IsString, IsUUID } from 'class-validator';
import { CategoryType } from '../../../domain/transaction-category/transaction-category';
import type { UUID } from '../../../../types/uuid.type';

export class CreateTransactionCategoryRequestDto {
  @IsEnum(CategoryType)
  type!: CategoryType;

  @IsString()
  name!: string;

  @IsString()
  icon!: string;
}

export class TransactionCategoryIdParams {
  @IsUUID()
  categoryId!: UUID;
}
