import { Module } from '@nestjs/common';
import { TransactionCategoryModule as TransactionCategoryDomainModule } from '../../domain/transaction-category/transaction-category.module';
import { TransactionCategoryController } from './transaction-category.controller';
import { UserModule } from '../../domain/user/user.module';
@Module({
  imports: [TransactionCategoryDomainModule, UserModule],
  controllers: [TransactionCategoryController],
})
export class TransactionCategoryModule {}
