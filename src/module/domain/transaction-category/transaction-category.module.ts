import { Module } from '@nestjs/common';
import { TransactionCategoryRepository } from './transaction-category.repository';
import { TransactionCategoryService } from './transaction-category.service';

@Module({
  providers: [TransactionCategoryRepository, TransactionCategoryService],
  exports: [TransactionCategoryService],
})
export class TransactionCategoryModule {}
