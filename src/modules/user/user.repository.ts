import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  createEntity(data: Partial<User>): User {
    return this.repo.create(data);
  }

  save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  findById(
    id: string,
  ): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'role',
        'createdAt',
      ],
    });
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findByEmail(
    email: string,
  ): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
    });
  }

  updatePasswordByEmail(
    email: string,
    hashedPassword: string,
  ): Promise<UpdateResult> {
    return this.repo.update(
      { email },
      { password: hashedPassword },
    );
  }

  deleteByEmail(
    email: string,
  ): Promise<DeleteResult> {
    return this.repo.delete({
      email,
    });
  }
}