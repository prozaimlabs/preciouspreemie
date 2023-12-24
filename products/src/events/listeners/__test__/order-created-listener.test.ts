import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Product } from '../../../models/products';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@prozaimlabs/common';

const setup = async () => {
    // create an instance of a listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create a fake product
    const product = Product.build({
        name: 'Boy Toy',
        price: 200,
        userId: 'asdf',
    });
    await product.save();

    // create a fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdf',
        expireAt: 'string',
        product: {
            id: product.id,
            price: product.price,
        },
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, product };
};

it('sets the orderId of the product', async () => {
    const { listener, data, msg, product } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product is created
    const UpdatedProduct = await Product.findById(product.id);

    expect(UpdatedProduct).toBeDefined();
    expect(UpdatedProduct!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, data, msg, product } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedProductData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(updatedProductData.orderId);
});
