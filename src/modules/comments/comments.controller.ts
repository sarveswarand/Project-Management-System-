import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards,Query, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {updateCommentDto} from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({
  status: 201,
  schema: {
    example: {
      id: 1,
      content: 'Nice work',
      taskId: 10,
      userId: 'uuid',
    },
  },
})
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

@Get('/task/:taskId')
@UseInterceptors(CacheInterceptor)
@CacheTTL(30000)
@HttpCode(200)
@ApiOperation({ summary: 'Get comments by task' })
@ApiParam({ name: 'taskId', example: 1 })
@ApiQuery({ name: 'page', example: 1 })
@ApiQuery({ name: 'limit', example: 10 })
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
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'id', example: 1 })
  update(@Param('id') id: number, @Body() updateCommentDto: updateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
