import { IsOptional } from "class-validator";

export class updateProjectDto{
    @IsOptional()
    name ?: string;

    @IsOptional()
    description ?: string;
}