import { Module } from '@nestjs/common';
import { InternalConfigModule } from './config/internal-config.module';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './encryption/encryption.module';
import { GuardModule } from './guard/guard.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    InternalConfigModule,
    DatabaseModule,
    EncryptionModule,
    GuardModule,
    TokenModule,
  ],
})
export class GlobalModule {}
