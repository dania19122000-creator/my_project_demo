import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/products-query.dto';
import { Product } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {
    }

    async findAll(query: ProductsQueryDto) {
        const { page, limit, search, minPrice, maxPrice, sort, order, categoryId } = query;
        const skip = (page - 1) * limit;
        const where: Prisma.ProductWhereInput = {};

        if(search) {
            where.title = {
                contains: search,// contains означает, что мы хотим найти все продукты, у которых в названии есть строка search
                mode: 'insensitive',// без учета регистра

            };
        }
        if(minPrice !== undefined || maxPrice !== undefined) {
            where.price = {}; // если minPrice или maxPrice есть, то мы создаем объект price, который будет содержать условия для фильтрации по цене

            if(minPrice !== undefined) {
                where.price.gte = minPrice
            }

            if(maxPrice !== undefined) {
                where.price.lte = maxPrice // lte означает, что цена должна быть меньше или равна maxPrice
            }
        }
        if(categoryId !== undefined) {
            where.categoryId = categoryId; // фильтрация по категории, мы просто добавляем условие categoryId в объект where
        }

        const [products, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where, // фильтрация по условиям, которые мы описали выше в объекте where
                skip,
                take: limit,
                orderBy: {
                    [sort]: order, // сортировка по полю sort в порядке order (asc или desc)

                },
                include: {
                    category: true, // включаем информацию о категории продукта
                    author: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        }
                    }
                }
            }),
            this.prisma.product.count({ where }),// считаем общее количество продуктов, которые соответствуют условиям фильтрации, чтобы мы могли вернуть эту информацию в мета-данных ответа
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };

    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                author: {
                    select: {
                        id: true, 
                        email: true,
                        name: true,
                    }
                }
            }
        });
        if(!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async create(dto: CreateProductDto, userId: number) {
        const product = await this.prisma.product.create({
            data: {
                title: dto.title,
                description: dto.description,
                price: dto.price,
                authorId: userId,
                categoryId: dto.categoryId,
            }

        });
        
        return product;
    }
    async update(id: number, dto: UpdateProductDto) {
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });
        if(!existing) {
            throw new NotFoundException('Product not found');
        }
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id: number) {
        const existing = await this.prisma.product.findUnique({ // пишем файнд юник, потому что если мы удалим, то мы не сможем найти его, и нам нужно проверить, существует ли он до удаления
            where: { id },
        });
        if(!existing) {
            throw new NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product removed' };
    }
}

    

