import { IsEnum, IsNumber } from 'class-validator';
import { Environment } from './validation/environment';
import { registerAs } from '@nestjs/config';
import { validateConfig } from './validation/config-validator';
import { Config } from './types/config';

export class BaseConfig {
  @IsEnum(Environment)
  environment!: string;

  @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
  port!: number;
}

export default registerAs(Config.BASE, () =>
  validateConfig(BaseConfig, {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
  }),
);
