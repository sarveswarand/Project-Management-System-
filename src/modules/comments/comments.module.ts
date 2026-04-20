import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { comment } from 'src/entities/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
