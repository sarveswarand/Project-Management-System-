import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
    private userRepo: Repository<User>,
    ) {}

    async createUser(createUserDto) {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds
    );

    const user = this.userRepo.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword, 
        role: createUserDto.role,
    });

    await this.userRepo.save(user);

    return { message: 'user created' };
}

    async getUser(userId: string) {
  const user = await this.userRepo.findOne({
    where: { id: userId }, select: ['id', 'name', 'email', 'role', 'createdAt']
  });

  return user;
}

    async getAllUser(){
        return this.userRepo.find();
    }

    async updatePassword(email: string, newPassword: string) {
  const user = await this.userRepo.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  user.password = hashedPassword;

  await this.userRepo.save(user);

  return { message: 'Password updated successfully' };
}

  async deleteUser(email: string) {
  const user = await this.userRepo.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.userRepo.delete(user);

  return { message: 'User deleted' };
}
    async findByEmail(email: string) {
  return this.userRepo.findOne({
    where: { email },
  });
}

}
