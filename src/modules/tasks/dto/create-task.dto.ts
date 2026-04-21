import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    title!: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty()
    projectId!: number;   

    @IsNotEmpty()
    userId!: string;
}