import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { InternalException } from '../../../exception/internal-exception';
import { InternalConfigService } from '../config/internal-config.service';

@Injectable()
export class TokenService {
  private readonly tokenSecret: string;
  constructor(private readonly internalConfigService: InternalConfigService) {
    this.tokenSecret = this.internalConfigService.getTokenConfig().tokenSecret;
  }
  public create(ttl: number, data: Record<string, unknown>): string {
    const exp = Math.floor(Date.now() / 1000) + ttl;

    return sign(
      {
        exp,
        data: JSON.stringify(data),
      },
      this.tokenSecret,
    );
  }

  public verify(token: string): Record<string, unknown> {
    try {
      const { data } = verify(token, this.tokenSecret) as JwtPayload;
      return JSON.parse(data);
    } catch (err) {
      throw new InternalException(
        'TOKEN.INVALID',
        err.errorMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
