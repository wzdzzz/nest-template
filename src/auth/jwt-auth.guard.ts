import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const access_token = req.get('Authorization')?.split(' ')[1];

    if (!access_token) {
      throw new HttpException('请先登录', HttpStatus.FORBIDDEN);
    }

    return super.canActivate(context);
  }
}

export const Public = () => SetMetadata('isPublic', true);
