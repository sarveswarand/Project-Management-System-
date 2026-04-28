import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('task')
@UseGuards(AuthGuard('jwt')) 
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto:CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: number, @Body() dto:UpdateTaskDto) {
    return this.taskService.updateTask(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }
}