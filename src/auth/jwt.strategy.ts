import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserResponse } from '../users/user.response';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    // 对应初始化passport-jwt策略的参数

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserResponse) {
    // jwt鉴权通过后，会返回鉴权信息，然后将对象设置在req.user上面
    return { email: payload.email, username: payload.username };
  }
}
