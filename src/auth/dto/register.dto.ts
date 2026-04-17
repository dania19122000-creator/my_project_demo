import { IsEmail, IsOptional, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    email!: string;

    @IsString()
    @MinLength(5)
    @IsOptional()
    name?: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password!: string;


}