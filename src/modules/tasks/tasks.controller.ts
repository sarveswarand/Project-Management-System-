import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() dto:CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto:UpdateTaskDto) {
    return this.taskService.updateTask(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }
}