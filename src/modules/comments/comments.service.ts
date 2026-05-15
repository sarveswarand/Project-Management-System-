import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from 'src/entities/comments.entity';
import { Repository } from 'typeorm';
import { updateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
    @InjectRepository(Comment)
    private commentRepository : Repository<Comment>
    ){}

    async create(createCommentDto: CreateCommentDto) {
    const newComment = this.commentRepository.create({
        content: createCommentDto.content,
        userId: createCommentDto.userId,
        task: { id: createCommentDto.taskId },
        parent: createCommentDto.parentId
            ? { id: createCommentDto.parentId }
            : undefined,   
    });

    return await this.commentRepository.save(newComment);
}

async findOne(id: number) {
  const comment =
    await this.commentRepository.findOne({
      where: { id },
    });

  if (!comment) {
    throw new NotFoundException(
      'Comment not found',
    );
  }

  return comment;
}

async findByTask(taskId: number, query) {
  const { page, limit } = query;

  const qb = this.commentRepository
    .createQueryBuilder('comment')
    .leftJoin('comment.parent', 'parent')
    .select([
      'comment.id',
      'comment.content',
      'comment.userId',
      'comment.createdAt',
      'parent.id',
    ])
    .where('comment.taskId = :taskId', { taskId })
    .orderBy('comment.createdAt', 'ASC');

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [comments, total] = await qb.getManyAndCount();

  const data = this.buildCommentTree(comments);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}

private buildCommentTree(comments: Comment[]): Comment[] {
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];

  // Step 1: Initialize map and replies array
  for (const comment of comments) {
    comment.replies = [];
    map.set(comment.id, comment);
  }

  // Step 2: Build relationships
  for (const comment of comments) {
    if (comment.parent && comment.parent.id) {
      const parent = map.get(comment.parent.id);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      // No parent → root comment
      roots.push(comment);
    }
    delete comment.parent; 
  }

  return roots;
}

// Update Comment
async update(id: number, updateCommentDto: updateCommentDto) {
  const result = await this.commentRepository
    .createQueryBuilder()
    .update(Comment)
    .set({
      ...(updateCommentDto.content && {
        content: updateCommentDto.content,
      }),
    })
    .where('id = :id', { id })
    .execute();

  if (result.affected === 0) {
    throw new Error('Comment not found');
  }

  return {
    message: 'Comment updated successfully',
  };
}

// Remove Comment
async remove(id: number) {
  const result = await this.commentRepository
    .createQueryBuilder()
    .delete()
    .from(Comment)
    .where('id = :id', { id })
    .execute();

  if (result.affected === 0) {
    throw new Error('Comment not found');
  }

  return {
    message: 'Comment removed',
  };
}
}
