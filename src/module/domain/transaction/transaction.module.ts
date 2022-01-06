import { Module } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';

@Module({
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
