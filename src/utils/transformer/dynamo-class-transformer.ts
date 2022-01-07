import { Transform } from 'class-transformer';

export const DynamoClassTransformer = <T>(): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol): void => {
    Transform(transformIncomingValue<T>(), { toClassOnly: true })(
      target,
      propertyKey,
    );

    Transform(transformOutgoingValue<T>(), {
      toPlainOnly: true,
    })(target, propertyKey);
  };
};

const transformIncomingValue =
  <T>() =>
  ({ value }: { value: string }): T => {
    return JSON.parse(value) as T;
  };

const transformOutgoingValue =
  <T>() =>
  ({ value }: { value: T }): string => {
    return JSON.stringify(value);
  };
