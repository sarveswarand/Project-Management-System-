import { Test, TestingModule } from '@nestjs/testing';

import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comments.entity';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockCommentRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockQB = {
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepo,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create comment successfully', async () => {
      const dto = {
        content: 'Hello',
        userId: 'u1',
        taskId: 1,
      };

      const created = { id: 1 };

      mockCommentRepo.create.mockReturnValue(created);
      mockCommentRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockCommentRepo.create).toHaveBeenCalled();
      expect(mockCommentRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('findOne', () => {
    it('should return comment', async () => {
      mockCommentRepo.findOne.mockResolvedValue({
        id: 1,
      });

      const result = await service.findOne(1);

      expect(mockCommentRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['replies'],
      });

      expect(result).toBeDefined();
    });
  });

  describe('findByTask', () => {
    it('should return paginated comment tree', async () => {
      mockCommentRepo.createQueryBuilder.mockReturnValue(mockQB);

      const flatComments = [
        { id: 1, content: 'A', parent: null },
        { id: 2, content: 'B', parent: { id: 1 } },
      ];

      mockQB.getManyAndCount.mockResolvedValue([
        flatComments,
        2,
      ]);

      const result = await service.findByTask(1, {
        page: 1,
        limit: 10,
      });

      expect(result.total).toBe(2);
      expect(result.data).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update comment successfully', async () => {
      mockCommentRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.execute.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, {
        content: 'updated',
      });

      expect(result.message).toBe(
        'Comment updated successfully',
      );
    });

    it('should throw if comment not found', async () => {
      mockCommentRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.execute.mockResolvedValue({ affected: 0 });

      await expect(
        service.update(1, { content: 'x' }),
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('remove', () => {
    it('should delete comment successfully', async () => {
      mockCommentRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.execute.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBe('Comment removed');
    });

    it('should throw if comment not found', async () => {
      mockCommentRepo.createQueryBuilder.mockReturnValue(mockQB);

      mockQB.execute.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(
        'Comment not found',
      );
    });
  });
});