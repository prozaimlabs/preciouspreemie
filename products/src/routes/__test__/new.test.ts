import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/products';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/products for post requests', async () => {
    const response = await request(app).post('/api/products').send({});

    expect(response.status).not.toEqual(404);
});

it('can only be access if the user is signed in', async () => {
    await request(app).post('/api/products').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid name is provided', async () => {
    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({ name: '', price: 10 })
        .expect(400);

    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({ price: 10 })
        .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({ name: 'asadasdf', price: -10 })
        .expect(400);

    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({ name: 'ewdasdff' })
        .expect(400);
});

it('creates a product with valid inputs', async () => {
    let products = await Product.find({});
    expect(products.length).toEqual(0);

    const name = 'asdadfadsf';

    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({ name, price: 42 })
        .expect(201);

    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].price).toEqual(42);
    expect(products[0].name).toEqual(name);
});

it('publishes an event', async () => {
    const name = 'asdadfadsf';

    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({ name, price: 42 })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
