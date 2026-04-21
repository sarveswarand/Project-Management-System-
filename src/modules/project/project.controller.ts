import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import {CreateProjectDto} from './dto/create-project.dto'
import {updateProjectDto} from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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

  @Post(':id/add-users')
  async addUsersToProject(@Param('id') id: number, @Body('userIds') userIds: string[]) {
    return this.projectService.addUsersToProject(id, userIds);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}
