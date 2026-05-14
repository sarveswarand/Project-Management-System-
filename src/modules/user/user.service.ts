import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto) {
    const saltRounds = 10;

    const hashedPassword =
      await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

    const user =
      this.userRepository.createEntity({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      });

    await this.userRepository.save(user);

    return {
      message: 'user created',
    };
  }

  async getUser(userId: string) {
    const user =
      await this.userRepository.findById(
        userId,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  async getAllUser(query) {
  return this.userRepository.findAll(query);
}

  async updatePassword(
    email: string,
    newPassword: string,
  ) {
    const user =
      await this.userRepository.findByEmail(
        email,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const saltRounds = 10;

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        saltRounds,
      );

    await this.userRepository.updatePasswordByEmail(
      email,
      hashedPassword,
    );

    return {
      message:
        'Password updated successfully',
    };
  }

  async deleteUser(email: string) {
    const user =
      await this.userRepository.findByEmail(
        email,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    await this.userRepository.deleteByEmail(
      email,
    );

    return {
      message: 'User deleted',
    };
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(
      email,
    );
  }
}