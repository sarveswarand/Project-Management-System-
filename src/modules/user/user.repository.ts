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

  async findAll(query): Promise<any> {
  const { page, limit, name, role } = query;

  const qb = this.repo
    .createQueryBuilder('user')
    .select([
      'user.id',
      'user.name',
      'user.email',
      'user.role',
      'user.createdAt',
    ]);

  // Filter by name
  if (name) {
    qb.andWhere('user.name LIKE :name', {
      name: `%${name}%`,
    });
  }

  // Filter by role
  if (role) {
    qb.andWhere('user.role = :role', { role });
  }

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  // Sorting
  qb.orderBy('user.createdAt', 'DESC');

  const [data, total] = await qb.getManyAndCount();

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
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