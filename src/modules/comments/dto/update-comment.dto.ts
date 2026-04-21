import { IsNotEmpty } from "class-validator";


export class updateCommentDto {
    @IsNotEmpty()
    content !: string;

}