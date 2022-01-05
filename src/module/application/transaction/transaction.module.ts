import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionModule as TransactionDomainModule } from '../../domain/transaction/transaction.module';
import { UserModule } from '../../domain/user/user.module';

@Module({
  controllers: [TransactionController],
  imports: [TransactionDomainModule, UserModule],
})
export class TransactionModule {}
