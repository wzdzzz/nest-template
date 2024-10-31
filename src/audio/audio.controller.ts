import { Public } from '@/auth/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Controller('audio')
export class AudioController {
  constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}

  @Public()
  @Get('transcode')
  async transcode() {
    const res: Job = await this.audioQueue.add(
      'transcode',
      {
        file: 'audio.mp3',
      },
      {
        jobId:
          Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      },
    );

    return res.id;
  }
}
