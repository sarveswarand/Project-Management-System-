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

    // async createUser(createUserDto) {
    //     const user = this.userRepo.create({
    //         name: createUserDto.name,
    //         email: createUserDto.email,
    //         password: createUserDto.password,
    //         role: createUserDto.role,
    //         // createdAt: new Date(),
    //     });
    //     console.log(createUserDto);
    //     await this.userRepo.save(user);
    //     return {message :'user created'};
    // }

    async getUser(email){
        const user= this.userRepo.find({where: email});
        return user;
    }

    async getAllUser(){
        return this.userRepo.find();
    }

    async updatePassword(email,newPassword){
        const user = await this.userRepo.findOne({where:{email}});
        if(!user){
            throw new NotFoundException('User not found');
        }
        user.password = newPassword;
        await this.userRepo.save(user);
        return user;
    }

    async deleteUser(email: string) {
  const user = await this.userRepo.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.userRepo.remove(user);

  return { message: 'User deleted' };
}
    async findByEmail(email: string) {
  return this.userRepo.findOne({
    where: { email },
  });
}

}
