import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Product } from '../../models/products';

const id = new mongoose.Types.ObjectId().toHexString();

it('returns a 404 if the provided product id does not exist', async () => {
    await request(app)
        .put(`/api/products/${id}`)
        .set('Cookie', global.signin())
        .send({ name: 'cap', price: 30 })
        .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
    await request(app)
        .put(`/api/products/${id}`)
        .send({ name: 'cap', price: 30 })
        .expect(401);
});

it('returns a 401 if the user does not own the product', async () => {
    const response = await request(app)
        .post(`/api/products`)
        .set('Cookie', global.signin())
        .send({ name: 'cap', price: 30 });

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({ name: 'cap', price: 30 })
        .expect(401);
});

it('returns a 401 if user provides an invalid name or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/products`)
        .set('Cookie', cookie)
        .send({ name: 'cap', price: 30 });

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ name: '', price: 30 })
        .expect(400);

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ name: 'cap', price: -30 })
        .expect(400);
});

it('updates the product provided the inputs are valid', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/products`)
        .set('Cookie', cookie)
        .send({ name: 'cap', price: 30 });

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ name: 'new cap', price: 30 })
        .expect(200);

    const productResponse = await request(app)
        .get(`/api/products/${response.body.id}`)
        .send();

    expect(productResponse.body.name).toEqual('new cap');
    expect(productResponse.body.price).toEqual(30);
});

it('publishes an event upon product update', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/products`)
        .set('Cookie', cookie)
        .send({ name: 'cap', price: 30 });

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ name: 'new cap', price: 30 })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the product is already reserved', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/products`)
        .set('Cookie', cookie)
        .send({ name: 'cap', price: 30 });

    const product = await Product.findById(response.body.id);
    product!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await product!.save();

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ name: 'new cap', price: 30 })
        .expect(400);
});
