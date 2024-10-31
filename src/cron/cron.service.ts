import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, time: string, onTick: () => void) {
    const job = new CronJob(`${time}`, onTick);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    return {
      job: name,
    };
  }

  deleteCronJob(name: string) {
    try {
      this.schedulerRegistry.deleteCronJob(name);
      return {
        job: name,
      };
    } catch (_err) {
      console.log(_err);
      throw new HttpException(
        'No Cron Job was found with the given name. Check that you created one with a decorator or with the create API.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
