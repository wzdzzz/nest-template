import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllResponseInterceptor } from './interceptor/all-response.interceptor';
import { AnyExceptionFilter } from './filters/any-exception.filter';
import { logger } from './middleware/logger.middleware';
import helmet from 'helmet';
import * as express from 'express';
import { ValidationPipe } from './pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('这个接口文档我是自动生成的')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('/api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  // 监听所有的请求路由，并打印日志
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true,
    maxAge: 3600,
  });
  app.use(helmet());
  app.enableVersioning();

  app.enableShutdownHooks();

  app.useGlobalInterceptors(new AllResponseInterceptor());
  app.useGlobalFilters(new AnyExceptionFilter());
  await app.listen(3000);
}

void bootstrap();
