import { validate } from './validation/environment-validator';
import baseConfig from './base.config';
import tokenConfig from './token.config';
import databaseConfig from './database.config';

export const configFactories = [baseConfig, tokenConfig, databaseConfig];

/**
 * NestJS configuration for the Config module
 */
export default {
  envFilePath: [
    '.env',
    '.env.production',
    '.env.test',
    '.env.dev',
    '.env.local',
  ],
  validate,
  load: configFactories,
};
