import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards,Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/modules/user/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiBody({type:CreateUserDto})
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        message: 'user created',
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'uuid',
        name: 'John',
        email: 'john@test.com',
        role: 'admin',
        createdAt: '2026-05-12T17:00:00.000Z',
      },
    },
  })

  @Get()
  async getUser(@Req() req: Request & { user: { userId: string } }) {
    return this.userService.getUser(req.user.userId);
  }

  // @UseGuards(AuthGuard('jwt'),RolesGuard)
  // @Roles('admin')
  // @HttpCode(HttpStatus.OK)
  // @Get('all')
  // async getAllUser(){
  //   return this.userService.getAllUser();
  // }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@HttpCode(HttpStatus.OK)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get all users with filters' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'limit', required: false, example: 10 })
@ApiQuery({ name: 'name', required: false })
@ApiQuery({ name: 'role', required: false })
@ApiResponse({
    status: 200,
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 100,
        data: [
          {
            id: 'uuid',
            name: 'John',
            email: 'john@test.com',
          },
        ],
      },
    },
  })
@Get('all')
async getAllUser(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('name') name?: string,
  @Query('role') role?: string,
) {
  return this.userService.getAllUser({
    page: Number(page),
    limit: Number(limit),
    name,
    role,
  });
}

  @UseGuards(AuthGuard('jwt'))
  @Throttle({default: { ttl: 60000, limit: 5 }})
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update password' })
  @ApiBody({
    schema: {
      example: {
        email: 'test@mail.com',
        newPassword: 'new123',
      },
    },
  })
  @Patch()
  async updatePassword(@Body() { email, newPassword }: { email: string; newPassword: string }) {
    return this.userService.updatePassword(email, newPassword);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin')
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by email' })
  @ApiBody({
    schema: {
      example: {
        email: 'test@mail.com',
      },
    },
  })
  async deleteUser(@Body('email') email:string){
    return this.userService.deleteUser(email);
  }
}
