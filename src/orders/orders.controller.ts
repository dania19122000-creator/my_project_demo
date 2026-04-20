import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {

    }
    @Post('checkout')
    checkout(@Req() req) {
        return this.ordersService.checkout(req.user.id);
    }
}
