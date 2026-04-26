import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";
import * as sanitizeHtml from 'sanitize-html';

export class updateCommentDto {
    @IsString()
    @Transform(({ value }) => sanitizeHtml(value.trim()))
    @IsNotEmpty()
    content !: string;
}