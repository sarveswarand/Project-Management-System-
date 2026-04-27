import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";
import sanitizeHtml from 'sanitize-html';

export class updateCommentDto {
    @IsString()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    @IsNotEmpty()
    content !: string;
}