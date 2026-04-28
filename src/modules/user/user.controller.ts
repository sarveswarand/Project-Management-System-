import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/modules/user/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Throttle } from '@nestjs/throttler';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUser(@Req() req: Request & { user: { userId: string } }) {
    return this.userService.getUser(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllUser(){
    return this.userService.getAllUser();
  }

  @UseGuards(AuthGuard('jwt'))
  @Throttle({default: { ttl: 60000, limit: 5 }})
  @HttpCode(HttpStatus.OK)
  @Patch()
  async updatePassword(@Body() { email, newPassword }: { email: string; newPassword: string }) {
    return this.userService.updatePassword(email, newPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Body('email') email:string){
    return this.userService.deleteUser(email);
  }
}
