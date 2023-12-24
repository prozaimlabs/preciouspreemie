import { ProductUpdatedEvent } from '@prozaimlabs/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Product } from '../../../models/products';
import { ProductUpdatedListener } from '../product-updated-listener';

const setup = async () => {
    // create an instance of Product Updated listener
    const listener = new ProductUpdatedListener(natsWrapper.client);

    // create a fake product
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'Boy Toy',
        price: 200,
    });
    await product.save();

    // create a fake data event
    const data: ProductUpdatedEvent['data'] = {
        id: product.id,
        version: product.version + 1,
        name: 'Girl toy',
        price: 100,
        userId: 'asdflkj',
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, product };
};

it('finds, updates, and saves a product', async () => {
    const { listener, data, msg, product } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product is created
    const UpdatedPoduct = await Product.findById(product.id);

    expect(UpdatedPoduct!.name).toEqual(data.name);
    expect(UpdatedPoduct!.price).toEqual(data.price);
    expect(UpdatedPoduct!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call the ack function if the event has a skipped version', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
});
