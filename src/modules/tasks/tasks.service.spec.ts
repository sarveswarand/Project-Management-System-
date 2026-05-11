import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TaskService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';

import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../audit/audit.service';

describe('TaskService', () => {
  let service: TaskService;

  const mockTaskRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockProjectRepo = {
    findOne: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockMailer = {
    sendMail: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockAuditService = {
    createLogChange: jest.fn(),
  };

  const mockQB = {
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepo },
        { provide: getRepositoryToken(Project), useValue: mockProjectRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: MailerService, useValue: mockMailer },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  /* ---------------- CREATE TASK ---------------- */
  describe('createTask', () => {
    it('should create task successfully', async () => {
      const dto = {
        title: 'Task 1',
        description: 'Desc',
        projectId: 1,
      };

      mockProjectRepo.findOne.mockResolvedValue({ id: 1 });

      mockTaskRepo.create.mockReturnValue({ id: 1 });

      mockTaskRepo.save.mockResolvedValue({ id: 1 });

      const result = await service.createTask(dto);

      expect(mockProjectRepo.findOne).toHaveBeenCalled();
      expect(mockTaskRepo.create).toHaveBeenCalled();
      expect(mockTaskRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw if project not found', async () => {
      mockProjectRepo.findOne.mockResolvedValue(null);

      await expect(service.createTask({ projectId: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* ---------------- FIND ALL ---------------- */
  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      mockTaskRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.getManyAndCount.mockResolvedValue([
        [{ id: 1 }],
        1,
      ]);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  /* ---------------- FIND ONE ---------------- */
  describe('findOne', () => {
    it('should return task', async () => {
      mockTaskRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.getOne.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toBeDefined();
    });

    it('should throw if task not found', async () => {
      mockTaskRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.getOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* ---------------- UPDATE TASK ---------------- */
  describe('updateTask', () => {
    it('should update status and log audit', async () => {
      const task = {
        id: 1,
        title: 'Task',
        status: 'TODO',
        assignedTo: null,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(task as any);

      mockUserRepo.findOne.mockResolvedValue({
        id: 'u1',
        name: 'John',
        email: 'john@test.com',
      });

      mockTaskRepo.save.mockResolvedValue(task);

      const result = await service.updateTask(
        1,
        { status: 'DONE' },
        { userId: 'admin' },
      );

      expect(mockTaskRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  /* ---------------- DELETE TASK ---------------- */
  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockTaskRepo.createQueryBuilder.mockReturnValue({
        delete: () => ({
          from: () => ({
            where: () => ({
              execute: jest.fn().mockResolvedValue({ affected: 1 }),
            }),
          }),
        }),
      });

      const result = await service.deleteTask(1);

      expect(result.message).toBe('Task deleted successfully');
    });

    it('should throw if task not found', async () => {
      mockTaskRepo.createQueryBuilder.mockReturnValue({
        delete: () => ({
          from: () => ({
            where: () => ({
              execute: jest.fn().mockResolvedValue({ affected: 0 }),
            }),
          }),
        }),
      });

      await expect(service.deleteTask(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* ---------------- ASSIGN TASK ---------------- */
  describe('assignTask', () => {
    it('should assign task successfully', async () => {
      mockTaskRepo.findOne.mockResolvedValue({
        id: 1,
        title: 'Task',
      });

      mockUserRepo.findOne.mockResolvedValue({
        id: 'u1',
        email: 'test@mail.com',
        name: 'John',
      });

      mockTaskRepo.save.mockResolvedValue({ id: 1 });

      const result = await service.assignTask(1, 'u1');

      expect(mockEventEmitter.emit).toHaveBeenCalled();
      expect(result.message).toBe('Task assigned successfully');
    });

    it('should throw if task not found', async () => {
      mockTaskRepo.findOne.mockResolvedValue(null);

      await expect(service.assignTask(1, 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});