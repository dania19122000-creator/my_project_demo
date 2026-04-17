import { Type } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {

    @IsString()// когда у нас валидейшн пайплайн, то мы должны указать, что это строка, иначе будет ошибка, что не может преобразовать в строку
    @IsNotEmpty()
    title!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    price!: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    categoryId?: number;

}