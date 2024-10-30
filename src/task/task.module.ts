import { Module } from '@nestjs/common';
import { TaskService } from '@/task/task.service';
import { TaskController } from '@/task/task.controller';
import { CronModule } from '@/cron/cron.module';

@Module({
  imports: [CronModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
