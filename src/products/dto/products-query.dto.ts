import  { PaginationDto } from './pagination.dto';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator'; // IsIn отличаеться от IsInt тем, что он проверяет, что значение находится в определенном наборе значений, а не является целым числом. Например, если мы хотим разрешить только определенные строки в качестве значения, мы можем использовать IsIn для проверки этого.


export class ProductsQueryDto extends PaginationDto {

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    maxPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @IsIn(['price', 'createdAt', 'title'])
    sort: string = 'createdAt';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    order: 'asc' | 'desc' = 'desc';
    
}

