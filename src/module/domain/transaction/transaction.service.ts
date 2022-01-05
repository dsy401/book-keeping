import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction';
import type { UUID } from '../../../types/uuid.type';
import { DateTime } from 'luxon';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  public async save(transaction: Transaction): Promise<void> {
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
}
