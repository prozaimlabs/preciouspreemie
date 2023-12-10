import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import { Product } from '../../models/products';
import { OrderStatus } from '@prozaimlabs/common';
import { Order } from '../../models/orders';

it('returns an error if the product does not exist', async () => {
    const productId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ productId })
        .expect(404);
});

it('returns an error if the product is already reserved', async () => {
    const product = Product.build({
        name: 'test product',
        price: 500,
    });
    await product.save();

    const order = Order.build({
        product,
        userId: 'test001',
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .expect(400);
});

it('reserves a product', async () => {
    const product = Product.build({
        name: 'test product',
        price: 500,
    });
    await product.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ productId: product.id })
        .expect(201);
});

it.todo('emits an order created event');
