import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import {CreateProjectDto} from './dto/create-project.dto'
import {updateProjectDto} from './dto/update-project.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guards';

@Controller('project')
@UseGuards(AuthGuard('jwt'),RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('admin') 
  @Post('create')
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get('all')
  async findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  async updateProject(@Param('id') id: number, @Body() updateProjectDto: updateProjectDto) {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @Roles('admin')
  @Post(':id/add-users')
  async addUsersToProject(@Param('id') id: number, @Body('userIds') userIds: string[]) {
    return this.projectService.addUsersToProject(id, userIds);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}
