import { IsString, IsOptional } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { validateConfig } from './validation/config-validator';
import { Config } from './types/config';

export class DatabaseConfig {
  @IsString()
  @IsOptional()
  connectionString: string | undefined;

  @IsString()
  region!: string;

  @IsString()
  userTableName!: string;

  @IsString()
  transactionTableName!: string;

  @IsString()
  transactionCategoryTableName!: string;

  @IsString()
  propertyTableName!: string;

  @IsString()
  propertyRecordTableName!: string;
}

export default registerAs(Config.DATABASE, () =>
  validateConfig(DatabaseConfig, {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
    region: process.env.DATABASE_REGION,
    userTableName: process.env.DATABASE_USER_TABLE,
    transactionTableName: process.env.DATABASE_TRANSACTION_TABLE,
    transactionCategoryTableName:
      process.env.DATABASE_TRANSACTION_CATEGORY_TABLE,
    propertyTableName: process.env.DATABASE_PROPERTY_TABLE,
    propertyRecordTableName: process.env.DATABASE_PROPERTY_RECORD_TABLE,
  }),
);
