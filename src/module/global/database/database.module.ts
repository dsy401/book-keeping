import { Module, Logger, Global } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { InternalConfigService } from '../config/internal-config.service';

const dynamodbClientFactory = {
  provide: DynamoDBClient,
  useFactory: (internalConfigService: InternalConfigService) => {
    const logger = new Logger(DatabaseModule.name);
    const { region, connectionString } =
      internalConfigService.getDatabaseConfig();

    logger.log(`Database region: ${region}`);
    logger.log(`Database connection string: ${connectionString}`);

    return new DynamoDBClient({ region, endpoint: connectionString });
  },
  inject: [InternalConfigService],
};

@Global()
@Module({
  providers: [dynamodbClientFactory],
  exports: [DynamoDBClient],
})
export class DatabaseModule {}
