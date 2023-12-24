import mongoose from 'mongoose';
import { app } from '../../app';
import { Product } from '../../models/products';
import request from 'supertest';

const buildProduct = async () => {
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'test product',
        price: 300,
    });
    await product.save();

    return product;
};

it('fetches orders for a particular user', async () => {
    // create three products
    const product1 = await buildProduct();
    const product2 = await buildProduct();
    const product3 = await buildProduct();

    const user1 = global.signin();
    const user2 = global.signin();

    // create one order as user #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ productId: product1.id })
        .expect(201);

    // create two orders as user #2
    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ productId: product2.id })
        .expect(201);

    const { body: order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ productId: product3.id })
        .expect(201);

    // Make request to get orders for user #2
    const user2sOrder = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    // Make sure we only got the orders for Users #2
    expect(user2sOrder.body.length).toEqual(2);
    //make sure that the order ids are the same
    expect(user2sOrder.body[0].id).toEqual(order1.id);
    expect(user2sOrder.body[1].id).toEqual(order2.id);

    expect(user2sOrder.body[0].product.id).toEqual(product2.id);
    expect(user2sOrder.body[1].product.id).toEqual(product3.id);
});
