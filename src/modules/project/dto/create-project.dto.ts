import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";
import * as sanitizeHtml from 'sanitize-html';

export class CreateProjectDto{
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name !: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    description !: string;

    @IsNotEmpty()
    @IsArray()
    userIds !: string[];
}