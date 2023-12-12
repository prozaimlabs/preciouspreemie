import { app } from '../../app';
import { Order, OrderStatus } from '../../models/orders';
import { Product } from '../../models/products';
import request from 'supertest';
import { natsWrapper } from '../../nats-wrapper';

it('deletes an order', async () => {
    // Create a product
    const product = Product.build({
        name: 'Baby toy',
        price: 500,
    });
    await product.save();

    const user = global.signin();

    //make a request to build an order with this product
    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ productId: product.id })
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order1.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(order1.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits order deleted event', async () => {
    // Create a product
    const product = Product.build({
        name: 'Baby toy',
        price: 500,
    });
    await product.save();

    const user = global.signin();

    //make a request to build an order with this product
    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ productId: product.id })
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order1.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
