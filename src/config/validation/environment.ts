/**
 * Defines the runtime environment of this service.
 */
export enum Environment {
  /**
   * Used for local development
   */
  LOCAL = 'local',

  /**
   * Used for deployed branches
   */
  DEVELOPMENT = 'development',

  /**
   * Set by Jest when running tests (it does not matter what you set in the .env file)
   */
  TEST = 'test',

  /**
   * Used when deploying to staging, beta, prod
   */
  PRODUCTION = 'production',
}
