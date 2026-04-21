import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { comment } from 'src/entities/comments.entity';
import { Repository } from 'typeorm';
import { updateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
    @InjectRepository(comment)
    private commentRepository : Repository<comment>
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
    return await this.commentRepository.find({
        where: { task: { id: taskId } },
        relations: ['replies'],
    });
}


}
