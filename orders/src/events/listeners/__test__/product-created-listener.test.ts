import { ProductCreatedEvent } from '@prozaimlabs/common';
import { natsWrapper } from '../../../nats-wrapper';
import { ProductCreatedListener } from '../product-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Product } from '../../../models/products';

const setup = async () => {
    // create an instance of a listener
    const listener = new ProductCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: ProductCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        name: 'Girl toy',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('creates and saves a product', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product is created
    const product = await Product.findById(data.id);

    expect(product).toBeDefined();
    expect(product!.name).toEqual(data.name);
    expect(product!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled();
});
