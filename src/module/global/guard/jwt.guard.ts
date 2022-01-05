import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { InternalException } from '../../../exception/internal-exception';
import { TokenService } from '../token/token.service';
import { UserService } from '../../domain/user/user.service';
import type { UUID } from '../../../types/uuid.type';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.headers['authorization'];

    if (!accessToken) {
      throw new InternalException(
        'AUTH.AUTHORIZATION_NOT_PROVIDED',
        'token not found',
        HttpStatus.FORBIDDEN,
      );
    }

    const data = this.tokenService.verify(accessToken);

    if (!data.userId || !data.isAccessToken) {
      throw new InternalException(
        'TOKEN.INVALID',
        'token is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.getByUserId(data.userId as UUID);

    if (!user) {
      throw new InternalException(
        'TOKEN.INVALID',
        'User not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    request.user = user;

    return true;
  }
}

export const UseJwtGuard = () => UseGuards(JwtGuard);
