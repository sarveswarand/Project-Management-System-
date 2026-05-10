import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, HttpCode,Query, UseInterceptors, ParseIntPipe, Req } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuditInterceptor } from 'src/common/interceptor/audit-interceptor';
import { Audit } from 'src/common/decorators/audit.decorator';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { In } from 'typeorm';

@Controller('task')
@UseGuards(AuthGuard('jwt')) 
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Audit('Create Task')
  @HttpCode(201)
  create(@Body() dto:CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Get('test-cache')
@CacheKey('test-cache')
@CacheTTL(300)
testCache() {
  console.log('API HIT', Date.now());

  return {
    message: 'cached',
    time: Date.now(),
  };
}

  // @Get()
  // @HttpCode(200)
  // findAll() {
  //   return this.taskService.findAll();
  // }

  @Get()
@HttpCode(200)
@UseInterceptors(CacheInterceptor)
@CacheTTL(60000)
findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('status') status?: string,
  @Query('projectId') projectId?: number,
  @Query('userId') userId?: string,
) {
  return this.taskService.findAll({
    page: Number(page),
    limit: Number(limit),
    status,
    projectId: projectId ? Number(projectId) : undefined,
    userId,
  });
}

  @Get(':id')
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: number, @Body() dto:UpdateTaskDto, @Req() req) {
    return this.taskService.updateTask(id, dto, req.user);
  }

  @Delete(':id')
  @Audit('Delete Task')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }

  @Patch(':taskId/assign/:userId')
async assignTask(
  @Param('taskId', ParseIntPipe) taskId: number,
  @Param('userId') userId: string,
) {
  return this.taskService.assignTask(taskId, userId);
}
}