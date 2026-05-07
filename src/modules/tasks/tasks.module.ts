import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { AuditModule } from '../audit/audit.module';
import { MailerModule } from 'node_modules/@nestjs-modules/mailer/dist/mailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User]), AuditModule, 
  MailerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (config: ConfigService) => ({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,

      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS')?.replace(/\s/g, ''),
      },
    },
  }),
}),
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
