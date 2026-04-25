import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/modules/user/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // async getUser(@Body() email:string){
  //   return this.userService.getUser(email);
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // async getUser(@Req() req: any) {
  //   return this.userService.getUser(req.user.userId);
  // }

  @UseGuards(AuthGuard('jwt'))
@Get()
async getUser(@Req() req: Request & { user: { userId: string } }) {
  return this.userService.getUser(req.user.userId);
}

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin')
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
