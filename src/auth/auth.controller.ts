import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginTokenDto,
  RefreshTokenDto,
  RegisterUserDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register({
      ...body,
      refresh_token: 'Refresh_token',
    });
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() body: LoginDto): Promise<LoginTokenDto> {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto): Promise<LoginTokenDto> {
    return this.authService.refreshToken(body.refreshToken);
  }
}
