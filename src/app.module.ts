import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthorModule } from './author/author.module';
import { ValidateLoginMiddleware } from './middleware/validate-login.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MockModule } from './mock/mock.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    BooksModule,
    AuthorModule,
    UsersModule,
    AuthModule,
    MockModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 拦截 p 模块
    consumer.apply(ValidateLoginMiddleware).forRoutes('author');
  }
}
