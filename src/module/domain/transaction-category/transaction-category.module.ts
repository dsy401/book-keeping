import { forwardRef, Module } from '@nestjs/common';
import { TransactionCategoryRepository } from './transaction-category.repository';
import { TransactionCategoryService } from './transaction-category.service';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [forwardRef(() => TransactionModule)],
  providers: [TransactionCategoryRepository, TransactionCategoryService],
  exports: [TransactionCategoryService],
})
export class TransactionCategoryModule {}
