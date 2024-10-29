import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponse } from '../users/user.response';

/**
 * 本地登录策略
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<UserResponse> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException('用户名或者密码错误', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
