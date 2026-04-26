import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import * as sanitizeHtml from 'sanitize-html';

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

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    userId!: string;
}