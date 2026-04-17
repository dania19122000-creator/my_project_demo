import { 

    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards, 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Query, Req } from '@nestjs/common';

import { Product } from '@prisma/client';
import { ProductsQueryDto } from './dto/products-query.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {
    }

    @Get()
    findAll(@Query() query: ProductsQueryDto) {
        return this.productsService.findAll(query);

    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(Number(id));
    }


    @UseGuards(JwtAuthGuard, RolesGuard) 
    @Roles('ADMIN')
    @Post()
    create(@Body() dto: CreateProductDto, @Req() req) {
        return this.productsService.create(dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    update(@Param('id') id: string, 
        @Body() dto: UpdateProductDto) {
            return this.productsService.update(Number(id), dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(Number(id));
    }
}

