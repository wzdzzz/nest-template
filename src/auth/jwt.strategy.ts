import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserResponse } from '../users/user.response';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../db/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: UserResponse,
  ): Promise<UserResponse | UnauthorizedException> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const cacheToken = await this.redisService.get(`token_${payload.id}`);

    if (!cacheToken) {
      throw new HttpException('token已过期', HttpStatus.UNAUTHORIZED);
    }

    if (token !== cacheToken) {
      throw new HttpException('token不正确', HttpStatus.UNAUTHORIZED);
    }

    await this.redisService.set(
      `token_${payload.id}`,
      token,
      this.configService.get('JWT_EXPIRATION_TIME'),
    );
    // jwt鉴权通过后，会返回鉴权信息，然后将对象设置在req.user上面
    return { email: payload.email, username: payload.username, id: payload.id };
  }
}
