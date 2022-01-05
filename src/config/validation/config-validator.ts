import {
  plainToClass,
  classToPlain,
  ClassConstructor,
} from 'class-transformer';
import { validateSync } from 'class-validator';

/**
 * Validates configuration files as they are registered.
 *
 * @param classConstructor The class with validation rules applied
 * @param config The plain config object
 * @returns A plain validated config object
 */
export const validateConfig = <T>(
  classConstructor: ClassConstructor<T>,
  config: Record<string, unknown>,
) => {
  const convertedConfig = plainToClass(classConstructor, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(<Record<string, unknown>>convertedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return classToPlain(convertedConfig);
};
