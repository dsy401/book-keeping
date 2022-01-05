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
}

export default registerAs(Config.DATABASE, () =>
  validateConfig(DatabaseConfig, {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
    region: process.env.DATABASE_REGION,
    userTableName: process.env.DATABASE_USER_TABLE,
    transactionTableName: process.env.DATABASE_TRANSACTION_TABLE,
  }),
);
