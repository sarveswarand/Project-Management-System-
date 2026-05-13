import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";
import sanitizeHtml from 'sanitize-html';
import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto{
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    @ApiProperty()
    name !: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    @ApiProperty()
    description !: string;

    @IsNotEmpty()
    @IsArray()
    @ApiProperty()
    userIds !: string[];
}