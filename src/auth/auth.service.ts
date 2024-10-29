import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { aes_encrypt } from '../utils/aes-secret';
import { UserResponse } from '../users/user.response';
import { RedisService } from '../db/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUser(email);
    const isSame = aes_encrypt(password) === user?.password;
    if (user && isSame) {
      return user;
    }
  }

  async generateToken(user: UserResponse) {
    const payload = { ...user };
    const access_token = this.jwtService.sign(payload);

    await this.redisService.set(
      `token_${user.id}`,
      access_token,
      this.configService.get('JWT_EXPIRATION_TIME'),
    );

    return {
      access_token,
    };
  }

  async register(user: RegisterDto) {
    return await this.usersService.register(user);
  }

  async logout(user: UserResponse) {
    await this.redisService.del(`token_${user.id}`);
  }
}
