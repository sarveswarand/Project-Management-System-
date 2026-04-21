import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {updateCommentDto} from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @Get('/task/:taskId')
findByTask(@Param('taskId') taskId: string) {
  return this.commentsService.findByTask(Number(taskId));
}

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: updateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
