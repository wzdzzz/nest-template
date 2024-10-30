import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, time: string, onTick: () => void): void {
    const job = new CronJob(`${time}`, onTick);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  deleteCronJob(name: string): void {
    this.schedulerRegistry.deleteCronJob(name);
  }
}
