import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '../../global/token/token.service';
import { UserService } from '../../domain/user/user.service';
import { InternalException } from '../../../exception/internal-exception';
import {
  RefreshTokenResponseDto,
  SignInResponseDto,
} from './types/response.type';
import { InternalConfigService } from '../../global/config/internal-config.service';
import { EncryptionService } from '../../global/encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly internalConfigService: InternalConfigService,
    private readonly encryptionService: EncryptionService,
  ) {}

  public async signIn(
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new InternalException(
        'USER.NOT_FOUND',
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (this.encryptionService.sha256Encrypt(password) !== user.password) {
      throw new InternalException(
        'AUTH.INCORRECT_PASSWORD',
        'password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { accessTokenTTL, refreshTokenTTL } =
      this.internalConfigService.getTokenConfig();

    const accessToken = this.tokenService.create(accessTokenTTL, {
      userId: user.userId,
      isAccessToken: true,
    });

    const refreshToken = this.tokenService.create(refreshTokenTTL, {
      userId: user.userId,
      isAccessToken: false,
      accessToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(
    refreshToken: string,
    accessToken: string,
  ): Promise<RefreshTokenResponseDto> {
    const data = this.tokenService.verify(refreshToken);

    if (
      !data.userId ||
      data.isAccessToken === true ||
      !data.accessToken ||
      data.accessToken !== accessToken
    ) {
      throw new InternalException(
        'TOKEN.INVALID',
        'Token is invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.getByUserId(data.userId as any);

    if (!user) {
      throw new InternalException(
        'TOKEN.INVALID',
        'User not exist',
        HttpStatus.FORBIDDEN,
      );
    }

    const { accessTokenTTL } = this.internalConfigService.getTokenConfig();

    const newAccessToken = this.tokenService.create(accessTokenTTL, {
      userId: user.userId,
      isAccessToken: true,
    });

    const newRefreshToken = this.tokenService.create(accessTokenTTL, {
      userId: user.userId,
      isAccessToken: false,
      accessToken: newAccessToken,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
