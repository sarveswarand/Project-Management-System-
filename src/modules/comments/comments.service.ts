import { Injectable } from '@nestjs/common';
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
    return await this.commentRepository.findOne({
        where: { id },
        relations: ['replies'],
    });
}

    async update(id: number, updateCommentDto: updateCommentDto){
        const comment = await this.commentRepository.findOneBy({id});
        if(!comment){
            throw new Error('Comment not found');
        }
        comment.content = updateCommentDto.content || comment.content;
        return await this.commentRepository.save(comment);
    }

    async remove(id: number){
        const comment = await this.commentRepository.findOneBy({id});
        if(!comment){
            throw new Error('Comment not found');
        }   
        await this.commentRepository.remove(comment);
        return {message : 'Comment removed'};
    }

    async findByTask(taskId: number) {
  // Step 1: Fetch all comments (flat)
  const comments = await this.commentRepository.find({
    where: { task: { id: taskId } },
    relations: ['parent'], // needed to access parent.id
    order: { createdAt: 'ASC' }, 
  });

  // Step 2: Build tree
  return this.buildCommentTree(comments);
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
    delete comment.parent; // Optional: remove parent reference to avoid circular JSON issues
  }

  return roots;
}


}
