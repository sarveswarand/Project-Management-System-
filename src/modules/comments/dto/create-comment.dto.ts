import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value.trim()))
  @ApiProperty()
  content!: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty()
  taskId!: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  userId!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({description:"Only for Reply comments"})
  parentId?: number;

  @IsOptional()
  replies?: CreateCommentDto[];
}