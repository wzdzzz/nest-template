import { Controller, Get } from '@nestjs/common';
import { TaskService } from '@/task/task.service';
import { Public } from '@/auth/jwt-auth.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Public()
  @Get()
  getStart() {
    return this.taskService.addCronJob('first', '*/10 * * * * *');
  }

  @Public()
  @Get('stop')
  getStop() {
    return this.taskService.deleteCron('first');
  }
}
