import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {
    }
    async create(dto: CreateCategoryDto) {
        const category = await this.prisma.category.create({
            data: {
                name: dto.name,
            },
        });

        return category;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            include: {
                products: true,
            },
        });
        return categories;
    }

    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
        if(!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async remove(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if(!category) {
            throw new NotFoundException('Category not found');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category removed' };
    }
}
