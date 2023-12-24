import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Product } from '../../../models/products';
import { OrderCancelledEvent } from '@prozaimlabs/common';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    // create an instance of a listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    // create a fake product
    const product = Product.build({
        name: 'Boy Toy',
        price: 200,
        userId: 'asdf',
    });
    product.set({ orderId });
    await product.save();

    // create a fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        product: {
            id: product.id,
        },
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, product, orderId };
};

it('updates the product, publishes an event, and acks the message', async () => {
    const { listener, data, msg, product, orderId } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product is created
    const updatedProduct = await Product.findById(product.id);

    expect(updatedProduct!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
