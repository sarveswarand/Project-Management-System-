import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { beforeEach, describe, it } from 'node:test';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    createEntity: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    updatePasswordByEmail: jest.fn(),
    deleteByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: UserRepository,
            useValue: mockUserRepository,
          },
        ],
      }).compile();

    service =
      module.get<UserService>(UserService);

    userRepository =
      module.get<UserRepository>(
        UserRepository,
      );

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        name: 'John',
        email: 'john@gmail.com',
        password: '123456',
        role: 'user',
      };

      const hashedPassword =
        'hashedPassword';

      const createdUser = {
        id: '1',
        ...createUserDto,
        password: hashedPassword,
      };

      (
        bcrypt.hash as jest.Mock
      ).mockResolvedValue(hashedPassword);

      mockUserRepository.createEntity.mockReturnValue(
        createdUser,
      );

      mockUserRepository.save.mockResolvedValue(
        createdUser,
      );

      const result =
        await service.createUser(
          createUserDto,
        );

      expect(bcrypt.hash).toHaveBeenCalledWith(
        '123456',
        10,
      );

      expect(
        userRepository.createEntity,
      ).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@gmail.com',
        password: hashedPassword,
        role: 'user',
      });

      expect(
        userRepository.save,
      ).toHaveBeenCalledWith(createdUser);

      expect(result).toEqual({
        message: 'user created',
      });
    });
  });

  describe('getUser', () => {
    it('should return user', async () => {
      const user = {
        id: '1',
        name: 'John',
      };

      mockUserRepository.findById.mockResolvedValue(
        user,
      );

      const result =
        await service.getUser('1');

      expect(
        userRepository.findById,
      ).toHaveBeenCalledWith('1');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(
        null,
      );

      await expect(
        service.getUser('1'),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllUser', () => {
    it('should return all users', async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      const users = [
        {
          id: '1',
          name: 'John',
        },
      ];

      mockUserRepository.findAll.mockResolvedValue(
        users,
      );

      const result =
        await service.getAllUser(query);

      expect(
        userRepository.findAll,
      ).toHaveBeenCalledWith(query);

      expect(result).toEqual(users);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const email = 'john@gmail.com';

      const user = {
        id: '1',
        email,
      };

      const hashedPassword =
        'newHashedPassword';

      mockUserRepository.findByEmail.mockResolvedValue(
        user,
      );

      (
        bcrypt.hash as jest.Mock
      ).mockResolvedValue(hashedPassword);

      mockUserRepository.updatePasswordByEmail.mockResolvedValue(
        undefined,
      );

      const result =
        await service.updatePassword(
          email,
          'newPassword',
        );

      expect(
        userRepository.findByEmail,
      ).toHaveBeenCalledWith(email);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'newPassword',
        10,
      );

      expect(
        userRepository.updatePasswordByEmail,
      ).toHaveBeenCalledWith(
        email,
        hashedPassword,
      );

      expect(result).toEqual({
        message:
          'Password updated successfully',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(
        null,
      );

      await expect(
        service.updatePassword(
          'john@gmail.com',
          'newPassword',
        ),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const email = 'john@gmail.com';

      const user = {
        id: '1',
        email,
      };

      mockUserRepository.findByEmail.mockResolvedValue(
        user,
      );

      mockUserRepository.deleteByEmail.mockResolvedValue(
        undefined,
      );

      const result =
        await service.deleteUser(email);

      expect(
        userRepository.findByEmail,
      ).toHaveBeenCalledWith(email);

      expect(
        userRepository.deleteByEmail,
      ).toHaveBeenCalledWith(email);

      expect(result).toEqual({
        message: 'User deleted',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(
        null,
      );

      await expect(
        service.deleteUser(
          'john@gmail.com',
        ),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = {
        id: '1',
        email: 'john@gmail.com',
      };

      mockUserRepository.findByEmail.mockResolvedValue(
        user,
      );

      const result =
        await service.findByEmail(
          'john@gmail.com',
        );

      expect(
        userRepository.findByEmail,
      ).toHaveBeenCalledWith(
        'john@gmail.com',
      );

      expect(result).toEqual(user);
    });
  });
});