import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import { Order } from '../../models/orders';
import { OrderStatus } from '@prozaimlabs/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('retuns a 404 when attempting to pay for an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: new mongoose.Types.ObjectId().toHexString(),
            token: 'asdf;lkj',
        })
        .expect(404);
});

it('retuns a 401 when user attempts to pay for an other that does not belong to them', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 400,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: order.id,
            token: 'asdflkj',
        })
        .expect(401);
});

it('retuns a 400 when attempting to pay for an order that is already cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const cancelledOrder = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 400,
        status: OrderStatus.Cancelled,
    });
    await cancelledOrder.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: cancelledOrder.id,
            token: 'asdf;lkj',
        })
        .expect(400);
});

it('successfully makes payment with valid inputs and returns 201', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 400,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'tok_visa',
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(order.price * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = Payment.findOne({
        orderId: order.id,
        paymentId: chargeOptions.id,
    });

    expect(payment).not.toBeNull();
});
