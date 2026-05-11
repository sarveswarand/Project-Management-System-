import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { ProjectService } from './project.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Project } from 'src/entities/project.entity';

describe('ProjectService', () => {
  let service: ProjectService;

  const mockProjectRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockQB = {
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    relation: jest.fn().mockReturnThis(),
    of: jest.fn().mockReturnThis(),
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepo,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);

    jest.clearAllMocks();
  });

  /* ---------------- CREATE PROJECT ---------------- */
  describe('createProject', () => {
    it('should create project successfully', async () => {
      const dto = {
        name: 'Project A',
        description: 'Test',
        userIds: ['1', '2'],
      };

      mockProjectRepo.findOne.mockResolvedValue(null);
      mockProjectRepo.create.mockReturnValue({ id: 1 });
      mockProjectRepo.save.mockResolvedValue({ id: 1 });

      const result = await service.createProject(dto);

      expect(mockProjectRepo.findOne).toHaveBeenCalled();
      expect(mockProjectRepo.create).toHaveBeenCalled();
      expect(mockProjectRepo.save).toHaveBeenCalled();
      expect(result.message).toBe('project created');
    });

    it('should throw if project already exists', async () => {
      mockProjectRepo.findOne.mockResolvedValue({ id: 1 });

      await expect(
        service.createProject({
          name: 'Project A',
          userIds: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  /* ---------------- FIND ALL ---------------- */
  describe('findAll', () => {
    it('should return paginated projects', async () => {
      mockProjectRepo.createQueryBuilder.mockReturnValue(mockQB);

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
    it('should return project', async () => {
      mockProjectRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.getOne.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toBeDefined();
    });
  });

  /* ---------------- REMOVE ---------------- */
  describe('remove', () => {
    it('should delete project', async () => {
      mockProjectRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockProjectRepo.delete).toHaveBeenCalledWith(1);
      expect(result.message).toBe('Project deleted successfully');
    });
  });

  /* ---------------- UPDATE PROJECT ---------------- */
  describe('updateProject', () => {
    it('should update project successfully', async () => {
      mockProjectRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.execute.mockResolvedValue({ affected: 1 });

      const result = await service.updateProject(1, {
        name: 'Updated',
      });

      expect(result.message).toBe(
        'Project updated successfully',
      );
    });

    it('should throw if project not found', async () => {
      mockProjectRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.execute.mockResolvedValue({ affected: 0 });

      await expect(
        service.updateProject(1, { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  /* ---------------- ADD USERS ---------------- */
  describe('addUsersToProject', () => {
    it('should add users successfully', async () => {
      mockProjectRepo.findOne.mockResolvedValue({
        id: 1,
      });

      mockProjectRepo.createQueryBuilder.mockReturnValue(
        mockQB,
      );

      const result = await service.addUsersToProject(
        1,
        ['u1', 'u2'],
      );

      expect(mockQB.add).toHaveBeenCalledWith(['u1', 'u2']);
      expect(result.message).toBe(
        'Users added successfully',
      );
    });

    it('should throw if project not found', async () => {
      mockProjectRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addUsersToProject(1, ['u1']),
      ).rejects.toThrow(NotFoundException);
    });
  });
});