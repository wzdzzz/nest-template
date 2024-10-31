import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { sleep } from '@/utils/sleep';

@Processor('audio')
export class AudioProcessor {
  @Process('transcode')
  async handleTranscode(job: Job) {
    console.log('Start transcoding...', job.id);
    await sleep(10000);
    console.log('Transcoding completed');

    return { data: new Date().getTime() };
  }
}
