import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionCategoryRepository } from './transaction-category.repository';
import { TransactionCategory } from './transaction-category';
import type { UUID } from '../../../types/uuid.type';
import { TransactionService } from '../transaction/transaction.service';
import { InternalException } from '../../../exception/internal-exception';

@Injectable()
export class TransactionCategoryService {
  constructor(
    private readonly transactionCategoryRepository: TransactionCategoryRepository,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
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

  public async delete(categoryId: UUID, userId: UUID): Promise<void> {
    const transactions = await this.transactionService.getByCategoryId(
      categoryId,
      userId,
    );

    if (transactions.length !== 0) {
      throw new InternalException(
        'TRANSACTION_CATEGORY.FAILED_TO_DELETE',
        'The category is still attached to at least one transactions',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.transactionCategoryRepository.delete(categoryId, userId);
  }
}
