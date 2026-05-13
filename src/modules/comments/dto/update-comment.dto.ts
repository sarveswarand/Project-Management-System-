import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";
import sanitizeHtml from 'sanitize-html';
import { ApiProperty } from "@nestjs/swagger";

export class updateCommentDto {
    @IsString()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    @IsNotEmpty()
    @ApiProperty()
    content !: string;
}