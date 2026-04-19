import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
