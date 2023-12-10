import { app } from '../../app';
import { Product } from '../../models/products';
import request from 'supertest';

it('fetches an order', async () => {
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

    // make a request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order1.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order1.id);
});

it('returns an error if another user tries to fetch that does not belong to them', async () => {
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

    // make a request to fetch the order with another user
    await request(app)
        .get(`/api/orders/${order1.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});
