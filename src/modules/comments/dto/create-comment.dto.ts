import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export class CreateCommentDto {
  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value.trim()))
  content!: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  taskId!: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  userId!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;

  @IsOptional()
  replies?: CreateCommentDto[];
}