import { Injectable } from '@nestjs/common';
import { TransactionCategoryRepository } from './transaction-category.repository';
import { TransactionCategory } from './transaction-category';
import type { UUID } from '../../../types/uuid.type';

@Injectable()
export class TransactionCategoryService {
  constructor(
    private readonly transactionCategoryRepository: TransactionCategoryRepository,
  ) {}

  public async save(category: TransactionCategory): Promise<void> {
    await this.transactionCategoryRepository.save(category);
  }

  public getByCategoryId(
    categoryId: UUID,
    userId: UUID,
  ): Promise<TransactionCategory | undefined> {
    return this.transactionCategoryRepository.getByCategoryId(
      categoryId,
      userId,
    );
  }

  public getByUserId(userId: UUID): Promise<TransactionCategory[]> {
    return this.transactionCategoryRepository.getByUserId(userId);
  }

  public delete(categoryId: UUID, userId: UUID): Promise<void> {
    return this.transactionCategoryRepository.delete(categoryId, userId);
  }
}
