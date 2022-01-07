import { forwardRef, Module } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionCategoryModule } from '../transaction-category/transaction-category.module';

@Module({
  imports: [forwardRef(() => TransactionCategoryModule)],
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
