import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
 
  @Transform(({ value }) => value.trim().lowercase()) 
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}