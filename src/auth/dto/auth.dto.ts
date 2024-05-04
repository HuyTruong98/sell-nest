import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  status: number;
  refresh_token: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginTokenDto {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
