import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Body } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Delete } from '@nestjs/common';
import { Param } from '@nestjs/common';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {
    }

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {// PfrseIntPipe - это пайп, который преобразует строку в число. Мы используем его, потому что id приходит в виде строки из параметров маршрута, а нам нужно число для работы с базой данных.
        return this.categoriesService.remove(id);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

}
