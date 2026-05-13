import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import sanitizeHtml from 'sanitize-html';
import { ApiProperty } from "@nestjs/swagger";

export class updateProjectDto{
    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    @ApiProperty()
    name ?: string;

    @IsOptional()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    @IsString()
    @ApiProperty()
    description ?: string;
}