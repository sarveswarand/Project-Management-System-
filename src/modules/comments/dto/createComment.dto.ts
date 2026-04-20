import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateCommentDto{
    @IsNotEmpty()
    content !: string;

    @IsNotEmpty()
    taskId !: number;

    @IsNotEmpty()
    userId !: string;
    
    @IsOptional()
    parentId ?: number;

    @IsOptional()
    replies ?: CreateCommentDto[];
}