import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RefreshTokenRequestDto,
  SignInRequestDto,
} from './types/request.types';
import {
  RefreshTokenResponseDto,
  SignInResponseDto,
} from './types/response.type';
import { UserService } from '../../domain/user/user.service';
import { User } from '../../domain/user/user';
import { EncryptionService } from '../../global/encryption/encryption.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post('sign-in')
  public async signIn(
    @Body() { email, password }: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(email, password);
  }

  @Post('refresh-token')
  public refreshToken(
    @Body() { refreshToken }: RefreshTokenRequestDto,
  ): RefreshTokenResponseDto {
    return {
      accessToken: this.authService.refreshToken(refreshToken),
    };
  }

  @Post('create-dummy-user')
  public async createDummyUser() {
    const user = new User(
      '111@qq.com',
      this.encryptionService.sha256Encrypt('3334'),
      'oliver',
      'deng',
      true,
      'Pacific/Auckland',
      'Ollie',
    );
    await this.userService.save(user);
    return 'ok';
  }
}
