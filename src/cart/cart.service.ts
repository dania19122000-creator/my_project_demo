import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}
    async getOrCreateCart(userId: number) {
        const existingCart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (existingCart) return existingCart;
        return this.prisma.cart.create({
            data: { userId },
        });
    }
    async getCart(userId: number) {
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

        if(!cart) {
            return { items: [], totalPrice: 0 };
        }

        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
        return {
            id: cart.id,
            items: cart.items,
            totalPrice,
        };
    }

    async addProduct(userId: number, productId: number, quantity: number) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const cart = await this.getOrCreateCart(userId);

        return this.prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,

                },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    }

    async updateQuantity(userId: number, productId: number, quantity: number) {
        const cart = await this.getOrCreateCart(userId);

        return this.prisma.cartItem.update({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            data: { quantity },
        });
    }

    async removeProduct(userId: number, productId: number) {
        const cart = await this.getOrCreateCart(userId);

        return this.prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
    }
}
