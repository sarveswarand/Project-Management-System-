import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  //  Create Task
  async createTask(dto) {
  const project = await this.projectRepo.findOne({
    where: { id: dto.projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  const user = await this.userRepo.findOne({
    where: { id: dto.userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const task = this.taskRepo.create({
    title: dto.title,
    description: dto.description,
    project,
    assignedTo: user,
  });

  return this.taskRepo.save(task);
}

  async findAll() {
    return this.taskRepo.find({
      relations: ['project', 'assignedTo'],
    });
  }

  //  Get one task
  async findOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'assignedTo'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  //  Update task
  async updateTask(id: number, dto) {
  const task = await this.findOne(id);

  if (dto.userId !== undefined) {
    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    task.assignedTo = user;
  }

  if (dto.status !== undefined) {
    task.status = dto.status;
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
}