import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction';
import type { UUID } from '../../../types/uuid.type';
import { DateTime } from 'luxon';
import { TransactionCategoryService } from '../transaction-category/transaction-category.service';
import { InternalException } from '../../../exception/internal-exception';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject(forwardRef(() => TransactionCategoryService))
    private readonly transactionCategoryService: TransactionCategoryService,
  ) {}

  public async save(transaction: Transaction): Promise<void> {
    const category = await this.transactionCategoryService.getByCategoryId(
      transaction.categoryId,
      transaction.userId,
    );

    if (!category) {
      throw new InternalException(
        'TRANSACTION.FAILED_TO_SAVE',
        'transaction category not found for categoryId',
        HttpStatus.NOT_FOUND,
      );
    }

    transaction.setCategory(category);

    await this.transactionRepository.save(transaction);
  }

  public async getByTransactionId(
    transactionId: UUID,
    userId: UUID,
  ): Promise<Transaction | undefined> {
    return this.transactionRepository.getByTransactionId(transactionId, userId);
  }

  public async delete(transactionId: UUID, userId: UUID): Promise<void> {
    return this.transactionRepository.delete(transactionId, userId);
  }

  public async getByDateRange(
    userId: UUID,
    startDate: DateTime,
    endDate: DateTime,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getByDateTimeRange(
      userId,
      startDate.toMillis(),
      endDate.toMillis(),
    );
  }

  public getByCategoryId(
    categoryId: UUID,
    userId: UUID,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getByCategoryId(categoryId, userId);
  }
}
