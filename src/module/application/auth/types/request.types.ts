import { IsEmail, IsString } from 'class-validator';

export class SignInRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshTokenRequestDto {
  @IsString()
  refreshToken!: string;

  @IsString()
  accessToken!: string;
}
