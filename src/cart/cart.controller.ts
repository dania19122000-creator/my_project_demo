import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { Get, Req, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Patch } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Param } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common'

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {
        
    }
    
    @Get()
    getCart(@Req() req) {
        return this.cartService.getCart(req.user.id);
    }
  
    @Post('items')
    addToCart(req, @Body() dto: AddToCartDto) {
        return this.cartService.addProduct(
            req.user.id,
            dto.productId,
            dto.quantity,
       );
           
    }

   
    @Patch('items')
    updateItem(@Req() req, @Body() dto: UpdateCartItemDto) {
        return this.cartService.updateQuantity(
            req.user.id,
            dto.productId,
            dto.quantity,
        );
    }

   
    @Delete('items/:productId')
    removeItem(@Req() req, @Param('productId') productId: number) {
        return this.cartService.removeProduct(req.user.id, productId);
    }


}
