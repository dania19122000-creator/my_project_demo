import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {// пагінація потрібна для того, щоб не повертати всі записи з бази даних одразу, а розбивати їх на сторінки. Це допомагає зменшити навантаження на сервер і покращити продуктивність.
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10; // нужен для обмеження максимальної кількості записів на сторінці
}