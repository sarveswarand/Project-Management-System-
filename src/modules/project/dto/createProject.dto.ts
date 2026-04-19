import { IsArray, IsNotEmpty } from "class-validator";

export class CreateProjectDto{
    @IsNotEmpty()
    name !: string;

    @IsNotEmpty()
    description !: string;

    @IsNotEmpty()
    @IsArray()
    userIds !: string[];
}