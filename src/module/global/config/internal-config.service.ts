import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Config } from '../../../config/types/config';
import { InternalException } from '../../../exception/internal-exception';
import { BaseConfig } from '../../../config/base.config';
import { TokenConfig } from '../../../config/token.config';
import { DatabaseConfig } from '../../../config/database.config';

@Injectable()
export class InternalConfigService {
  constructor(private readonly configService: ConfigService) {}

  getBaseConfig(): BaseConfig {
    return this.get<BaseConfig>(Config.BASE);
  }

  getTokenConfig(): TokenConfig {
    return this.get<TokenConfig>(Config.TOKEN);
  }

  getDatabaseConfig(): DatabaseConfig {
    return this.get<DatabaseConfig>(Config.DATABASE);
  }

  get<T>(configName: Config): T {
    const value = this.configService.get<T>(configName);

    if (!value) {
      throw new InternalException(
        'INTERNAL.MISSING_CONFIG',
        `Could not find config. (name: ${configName})`,
      );
    }

    return value;
  }
}
