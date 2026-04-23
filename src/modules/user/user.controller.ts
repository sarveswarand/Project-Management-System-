import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/modules/user/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getUser(@Body() email:string){
    return this.userService.getUser(email);
  }

  @Get('all')
  async getAllUser(){
    return this.userService.getAllUser();
  }
  
  @Patch()
  async updatePassword(@Body() { email, newPassword }: { email: string; newPassword: string }) {
    return this.userService.updatePassword(email, newPassword);
  }

  @Delete()
  async deleteUser(@Body('email') email:string){
    return this.userService.deleteUser(email);
  }
}
