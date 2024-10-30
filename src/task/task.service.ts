import { Injectable } from '@nestjs/common';
import { CronService } from '@/cron/cron.service';

@Injectable()
export class TaskService {
  constructor(private readonly cronService: CronService) {}

  addCronJob(name: string, seconds: string) {
    this.cronService.addCronJob(name, seconds, () => {
      console.log(`job-${name} added for each minute at ${seconds} seconds!`);
    });

    return `job-${name} added for each minute at ${seconds} seconds!`;
  }

  deleteCron(name: string) {
    this.cronService.deleteCronJob(name);

    return `job-${name} deleted!`;
  }
}
