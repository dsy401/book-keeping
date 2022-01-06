import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import * as path from 'path';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { AuthModule } from './module/application/auth/auth.module';
import { GlobalModule } from './module/global/global.module';
import { TransactionModule } from './module/application/transaction/transaction.module';
import { TransactionCategoryModule } from './module/application/transaction-category/transaction-category.module';
import { PropertyModule } from './module/application/property/property.module';
@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot(config),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: !process.env.NODE_ENV,
      },
    }),
    AuthModule,
    TransactionModule,
    TransactionCategoryModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
