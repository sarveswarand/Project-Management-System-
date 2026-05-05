import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User]), AuditModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
