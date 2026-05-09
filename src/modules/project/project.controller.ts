import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards,Query, UseInterceptors } from '@nestjs/common';
import { ProjectService } from './project.service';
import {CreateProjectDto} from './dto/create-project.dto'
import {updateProjectDto} from './dto/update-project.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('project')
@UseGuards(AuthGuard('jwt'),RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('admin') 
  @Post('create')
  @HttpCode(201)
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
@CacheTTL(60)
@HttpCode(200)
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
  async findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  async updateProject(@Param('id') id: number, @Body() updateProjectDto: updateProjectDto) {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @Roles('admin')
  @Post(':id/add-users')
  @HttpCode(200)
  async addUsersToProject(@Param('id') id: number, @Body('userIds') userIds: string[]) {
    return this.projectService.addUsersToProject(id, userIds);
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}
