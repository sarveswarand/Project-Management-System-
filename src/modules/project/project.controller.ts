import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards,Query, UseInterceptors } from '@nestjs/common';
import { ProjectService } from './project.service';
import {CreateProjectDto} from './dto/create-project.dto'
import {updateProjectDto} from './dto/update-project.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('project')
@UseGuards(AuthGuard('jwt'),RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('admin') 
  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create project' })
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      example1: {
        value: {
          name: 'SOA Project',
          description: 'Project description',
          userIds: ['uuid-user-1', 'uuid-user-2'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        message: 'project created',
        data: {
          id: 1,
          name: 'SOA Project',
          description: 'Project description',
          createdAt: '2026-05-12T10:00:00.000Z',
          users: [{ id: 'uuid-user-1' }, { id: 'uuid-user-2' }],
        },
      },
    },
  })

  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  // @Get('all')
  // @HttpCode(200)
  // async findAll() {
  //   return this.projectService.findAll();
  // }

  // Controller
@Get('all')
@UseInterceptors(CacheInterceptor)
@CacheTTL(60000)
@HttpCode(200)
@ApiOperation({ summary: 'Get all projects with filters' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'limit', required: false, example: 10 })
@ApiQuery({ name: 'name', required: false, example: 'SOA' })
@ApiQuery({ name: 'userId', required: false, example: 'uuid-user-id' })
@ApiResponse({
    status: 200,
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 20,
        totalPages: 2,
        data: [
          {
            id: 1,
            name: 'SOA Project',
            description: 'Project desc',
            users: [{ id: 'uuid-user-id' }],
          },
        ],
      },
    },
  })
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('name') name?: string,
  @Query('userId') userId?: string,
) {
  return this.projectService.findAll({
    page: Number(page),
    limit: Number(limit),
    name,
    userId,
  });
}

  @Get(':id')
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        name: 'SOA Project',
        description: 'Project description',
        users: [{ id: 'uuid-user-id' }],
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: updateProjectDto,
    examples: {
      example1: {
        value: {
          name: 'Updated Project',
          description: 'Updated description',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Project updated successfully',
      },
    },
  })
  async updateProject(@Param('id') id: number, @Body() updateProjectDto: updateProjectDto) {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @Roles('admin')
  @Post(':id/add-users')
  @HttpCode(200)
  @ApiOperation({ summary: 'Add users to project' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      example: {
        userIds: ['uuid-user-1', 'uuid-user-2'],
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Users added successfully',
      },
    },
  })
  async addUsersToProject(@Param('id') id: number, @Body('userIds') userIds: string[]) {
    return this.projectService.addUsersToProject(id, userIds);
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 204,
    description: 'Project deleted successfully',
  })
  async remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}
