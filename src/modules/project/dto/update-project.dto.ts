import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import * as sanitizeHtml from 'sanitize-html';

export class updateProjectDto{
    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    name ?: string;

    @IsOptional()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    @IsString()
    description ?: string;
}