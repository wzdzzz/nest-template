import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ValidateLoginMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('走了登录中间件：', req.method, req.url);
    next();
  }
}
