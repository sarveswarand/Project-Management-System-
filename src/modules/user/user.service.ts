import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
    private userRepo: Repository<User>,
    ) {}

    async createUser(createUserDto) {
        const user = this.userRepo.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
            createdAt: new Date(),
        });
        await this.userRepo.save(user);
        return {message :'user created'};
    }

    async getUser(email){
        const user= this.userRepo.find({where:email});
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
        return user;
    }

    async deleteUser(email){
        await this.userRepo.delete(email);
        return {message :'User deleted'};
    }

}
