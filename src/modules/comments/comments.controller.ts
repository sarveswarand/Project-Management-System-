import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards,Query, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {updateCommentDto} from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  // @Get('/task/:taskId')
  // @HttpCode(200)
  // findByTask(@Param('taskId') taskId: string) {
  //   return this.commentsService.findByTask(Number(taskId));
  // }

@Get('/task/:taskId')
@UseInterceptors(CacheInterceptor)
@CacheTTL(30000)
@HttpCode(200)
findByTask(
  @Param('taskId', ParseIntPipe) taskId: number,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  return this.commentsService.findByTask(taskId, {
    page: Number(page),
    limit: Number(limit),
  });
}

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: number, @Body() updateCommentDto: updateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
