import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Environment } from './environment';
/**
 * Defines the environment variables used by this service.
 */
export class EnvironmentVariables {
  // Base
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsNumber({ maxDecimalPlaces: 0, allowInfinity: false, allowNaN: false })
  PORT!: number;

  // Token
  @IsString()
  TOKEN_SECRET!: string;

  @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
  ACCESS_TOKEN_TTL!: number;

  @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
  REFRESH_TOKEN_TTL!: number;

  // Database
  @ValidateIf((o) => o.NODE_ENV === Environment.LOCAL)
  @IsString()
  DATABASE_CONNECTION_STRING?: string;

  @IsString()
  DATABASE_REGION!: string;

  @IsString()
  DATABASE_USER_TABLE!: string;

  @IsString()
  DATABASE_TRANSACTION_TABLE!: string;

  @IsString()
  DATABASE_TRANSACTION_CATEGORY_TABLE!: string;

  @IsString()
  DATABASE_PROPERTY_TABLE!: string;
}
