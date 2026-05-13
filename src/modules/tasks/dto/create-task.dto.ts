import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    @ApiProperty()
    title!: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    @ApiProperty()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    projectId!: number;   

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    @ApiProperty()
    userId?: string;
}