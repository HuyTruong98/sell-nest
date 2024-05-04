import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, LoginTokenDto, RegisterUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(body: RegisterUserDto): Promise<User> {
    const hashPwd = await this.hashPwd(body?.password);
    return await this.userRepository.save({ ...body, password: hashPwd });
  }

  async login(body: LoginDto): Promise<LoginTokenDto> {
    const user = await this.findEmail(body?.email);
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPwd = bcrypt.compareSync(body?.password, user.password);

    if (!checkPwd) {
      throw new HttpException(
        'Password is not correct!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload);
  }

  async refreshToken(refreshToken: string): Promise<LoginTokenDto> {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('SECRET_KEY'),
      });

      const checkExitToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token: refreshToken,
      });

      if (checkExitToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException(
          'Refresh token is not valid!',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(payload: { id: number; email: string }) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET_KEY'),
      expiresIn: this.config.get<string>('EXP_IN_ACCESS_TOKEN'),
    });

    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refreshToken },
    );

    return { accessToken, refreshToken };
  }

  private async hashPwd(pwd: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(pwd, salt);

    return hash;
  }

  private async findEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user) {
      return user;
    }

    return undefined;
  }
}
