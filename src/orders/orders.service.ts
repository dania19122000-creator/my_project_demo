import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {

    }

    async checkout(userId: number) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if(!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }
        const total = cart.items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0)
        const order = await this.prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return order;
    }
}
