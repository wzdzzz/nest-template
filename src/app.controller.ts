import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/jwt-auth.guard';

@ApiTags('测试')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '测试' })
  getHello(): string {
    return this.appService.getHello();
  }
}
