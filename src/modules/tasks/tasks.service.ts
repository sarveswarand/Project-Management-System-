import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { TASK_ASSIGNED_EVENT, TASK_STATUS_UPDATED_EVENT } from './task.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mailerService: MailerService,
    private eventEmitter: EventEmitter2,
    private auditService: AuditService,
  ) {}

  //  Create Task
  async createTask(dto) {
  const project = await this.projectRepo.findOne({
    where: { id: dto.projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  let user : User | null = null;

  if (dto.userId) {
    user = await this.userRepo.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  const task = this.taskRepo.create({
    title: dto.title,
    description: dto.description,
    project,
    assignedTo: user || undefined,
  });

  return this.taskRepo.save(task);
}

async findAll(query) {
  const { page, limit, status, projectId, userId } = query;

  const qb = this.taskRepo
    .createQueryBuilder('task')
    .leftJoin('task.project', 'project')
    .leftJoin('task.assignedTo', 'user')
    .select([
      'task.id',
      'task.title',
      'task.description',
      'task.status',
      'project.id',
      'project.name',
      'user.id',
      'user.name',
      'user.email',
    ]);

  // Filters
  if (status) {
    qb.andWhere('task.status = :status', { status });
  }

  if (projectId) {
    qb.andWhere('project.id = :projectId', { projectId });
  }

  if (userId) {
    qb.andWhere('user.id = :userId', { userId });
  }

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  // Sorting
  qb.orderBy('task.id', 'DESC');

  const [data, total] = await qb.getManyAndCount();

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}


// Get one task (only required fields)
async findOne(id: number) {
  const task = await this.taskRepo
    .createQueryBuilder('task')
    .leftJoin('task.project', 'project')
    .leftJoin('task.assignedTo', 'user')
    .select([
      'task.id',
      'task.title',
      'task.description',
      'task.status',
      'project.id',
      'project.name',
      'user.id',
      'user.name',
      'user.email',
    ])
    .where('task.id = :id', { id })
    .getOne();

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
}

  //  Update task
//   async updateTask(id: number, dto) {
//   const task = await this.findOne(id);
//   console.log(task.assignedTo);
  
//   console.log('MAIL_USER:', process.env.MAIL_USER);
// console.log('MAIL_PASS:', process.env.MAIL_PASS);

//   if (dto.userId !== undefined) {
//     // const user = await this.userRepo.findOne({
//     //   where: { id: dto.userId },
//     // });
//     const user = await this.userRepo.findOne({
//   where: { id: dto.userId },

//   select: [
//     'id',
//     'name',
//     'email',
//     'role',
//   ],
// });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     console.log(user);
// console.log(user.email);

//     task.assignedTo = user;
//     this.eventEmitter.emit(TASK_ASSIGNED_EVENT, {
//       email: user.email,
//       title: task.title,
//     });

//   }


//   if (dto.status !== undefined) {
//   task.status = dto.status;
//   if(task.assignedTo?.email) {

//   this.eventEmitter.emit(TASK_STATUS_UPDATED_EVENT, {
//     email: task.assignedTo?.email,
//     title: task.title,
//     status: dto.status,
//   });
// }
// }

//   return this.taskRepo.save(task);
// }

async updateTask(id: number, dto, currentUser) {
  const task = await this.findOne(id);

  const oldStatus = task.status;

  const oldAssignedUser = task.assignedTo
    ? {
        id: task.assignedTo.id,
        name: task.assignedTo.name,
      }
    : null;


  if (dto.userId !== undefined) {
    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
      select: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update task assignee
    task.assignedTo = user;

    if (oldAssignedUser?.id !== user.id) {
      await this.auditService.createLogChange({
        action: 'TASK_ASSIGNEE_CHANGED',

        userId: currentUser.userId,
        // userName: currentUser.name,

        taskId: task.id,
        taskTitle: task.title,

        oldValue: oldAssignedUser,

        newValue: {
          id: user.id,
          name: user.name,
        },

        // status: 'SUCCESS',
      });
    }

    this.eventEmitter.emit(TASK_ASSIGNED_EVENT, {
      email: user.email,
      title: task.title,
    });
  }

  if (dto.status !== undefined) {
    task.status = dto.status;

    if (oldStatus !== dto.status) {
      await this.auditService.createLogChange({
        action: 'TASK_STATUS_CHANGED',

        userId: currentUser.userId,
        // userName: currentUser.name,

        taskId: task.id,
        taskTitle: task.title,

        oldValue: oldStatus,
        newValue: dto.status,

        // status: 'SUCCESS',
      });
    }

    if (task.assignedTo?.email) {
      this.eventEmitter.emit(TASK_STATUS_UPDATED_EVENT, {
        email: task.assignedTo.email,
        title: task.title,
        status: dto.status,
      });
    }
  }

  return this.taskRepo.save(task);
}

  //  Delete task
  // async deleteTask(id: number) {
  //   const task = await this.findOne(id);
  //   return this.taskRepo.delete(task);
  // }

    async deleteTask(id: number) {
    const result = await this.taskRepo
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return {
      message: 'Task deleted successfully',
    };
  }

  async assignTask(taskId: number, userId: string) {
  const task = await this.taskRepo.findOne({
    where: { id: taskId },
    relations: ['assignedTo'],
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  const user = await this.userRepo.findOne({
    where: { id: userId }, select: ['id', 'name', 'email'],
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  task.assignedTo = user;

  await this.taskRepo.save(task);

  await this.eventEmitter.emit(TASK_ASSIGNED_EVENT, {
    email: user.email,
    title: task.title,
  });
  return {
    message: 'Task assigned successfully',
    task,
  };
}
}