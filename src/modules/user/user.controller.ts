import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/common/dto/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getUser(@Body() email:string){
    console.log("get particule user");
    return this.userService.getUser(email);
  }

  @Get('all')
  async getAllUser(){
    console.log("get-all api hit ");
    return this.userService.getAllUser();
  }
  
  @Patch()
  async updatePassword(@Body() email:string, @Body() newPassword:string){
    return this.userService.updatePassword(email,newPassword);
  }

  @Delete()
  async deleteUser(@Body() email:string){
    return this.userService.deleteUser(email);
  }
}
