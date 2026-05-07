import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    title!: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    projectId!: number;   

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    userId?: string;
}