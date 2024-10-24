import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  async getData() {
    return 'Hello World!';
  }
}
