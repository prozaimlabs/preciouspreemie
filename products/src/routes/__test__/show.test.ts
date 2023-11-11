import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the product is not found', async () => {
    await request(app).get('/api/products/afasdfasdfasdfa').send().expect(404);
});

it('returns the product if the product is found', async () => {
    const name = 'Diaper';
    const price = 30;

    const response = await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({ name, price })
        .expect(201);

    const productResponse = await request(app)
        .get(`/api/products/${response.body.id}`)
        .send({})
        .expect(200);

    expect(productResponse.body.name).toEqual(name);
    expect(productResponse.body.price).toEqual(price);
});
