import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, HttpCode,Query, UseInterceptors, ParseIntPipe, Req } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuditInterceptor } from 'src/common/interceptor/audit-interceptor';
import { Audit } from 'src/common/decorators/audit.decorator';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { In } from 'typeorm';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('task')
@UseGuards(AuthGuard('jwt')) 
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Audit('Create Task')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      example1: {
        value: {
          title: 'Fix login bug',
          description: 'Resolve JWT issue',
          projectId: 1,
          userId: 'uuid-user-id',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Fix login bug',
        status: 'OPEN',
        projectId: 1,
        userId: 'uuid-user-id',
        createdAt: '2026-05-12T10:00:00.000Z',
      },
    },
  })
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

@Get()
@ApiOperation({ summary: 'Get all tasks with filters' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'limit', required: false, example: 10 })
@ApiQuery({ name: 'status', required: false, example: 'TODO' })
@ApiQuery({ name: 'projectId', required: false, example: 1 })
@ApiQuery({ name: 'userId', required: false, example: 'uuid-user-id' })
@ApiResponse({
    status: 200,
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 50,
        data: [
          {
            id: 1,
            title: 'Fix bug',
            status: 'OPEN',
          },
        ],
      },
    },
  })
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
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        title: 'Fix bug',
        status: 'OPEN',
        projectId: 1,
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: UpdateTaskDto,
    examples: {
      example1: {
        value: {
          status: 'IN_PROGRESS',
          userId: 'uuid-user-id',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Task updated successfully',
      },
    },
  })
  update(@Param('id') id: number, @Body() dto:UpdateTaskDto, @Req() req) {
    return this.taskService.updateTask(id, dto, req.user);
  }

  @Delete(':id')
  @Audit('Delete Task')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully',
  })
  remove(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }

@Patch(':taskId/assign/:userId')
@ApiOperation({ summary: 'Assign task to user' })
@ApiParam({ name: 'taskId', example: 1 })
@ApiParam({ name: 'userId', example: 'uuid-user-id' })
@ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Task assigned successfully',
      },
    },
  })
async assignTask(
  @Param('taskId', ParseIntPipe) taskId: number,
  @Param('userId') userId: string,
) {
  return this.taskService.assignTask(taskId, userId);
}
}