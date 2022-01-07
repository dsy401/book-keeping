import {
  ClassConstructor,
  classToPlain,
  plainToClass,
  Transform,
} from 'class-transformer';

export const DynamoClassTransformer = <T>(
  classConstructor: ClassConstructor<T>,
): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol): void => {
    Transform(transformIncomingValue<T>(classConstructor), {
      toClassOnly: true,
    })(target, propertyKey);

    Transform(transformOutgoingValue<T>(), {
      toPlainOnly: true,
    })(target, propertyKey);
  };
};

const transformIncomingValue =
  <T>(classConstructor: ClassConstructor<T>) =>
  ({ value }: { value: string }) => {
    return plainToClass(JSON.parse(value), classConstructor);
  };

const transformOutgoingValue =
  <T>() =>
  ({ value }: { value: T }): string => {
    return JSON.stringify(classToPlain(value));
  };
