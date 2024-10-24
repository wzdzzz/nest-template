import { Controller, Get } from '@nestjs/common';
import { MockService } from './mock.service';
import { Public } from '../auth/jwt-auth.guard';
import { sleep } from '../utils/sleep';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('mock数据')
@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取mock数据' })
  async getData() {
    await sleep(1000 * 5);
    return this.mockService.getData();
  }
}
