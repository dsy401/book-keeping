import { IsString, IsNumber } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { validateConfig } from './validation/config-validator';
import { Config } from './types/config';

export class TokenConfig {
  @IsString()
  tokenSecret!: string;

  @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
  accessTokenTTL!: number;

  @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
  refreshTokenTTL!: number;
}

export default registerAs(Config.TOKEN, () =>
  validateConfig(TokenConfig, {
    tokenSecret: process.env.TOKEN_SECRET,
    accessTokenTTL: process.env.ACCESS_TOKEN_TTL,
    refreshTokenTTL: process.env.REFRESH_TOKEN_TTL,
  }),
);
