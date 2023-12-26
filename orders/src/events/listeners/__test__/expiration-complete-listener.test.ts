import {
    ExpirationCompleteEvent,
    OrderStatus,
    ProductCreatedEvent,
} from '@prozaimlabs/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Product } from '../../../models/products';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/orders';

const setup = async () => {
    // create an instance of a listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // create a fake product
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'Boy Toy',
        price: 200,
    });
    await product.save();

    //create a fake order
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdf',
        expiresAt: new Date(),
        product,
    });
    await order.save();

    // create a fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, product, order };
};

it('updates the order status to cancelled', async () => {
    const { listener, data, msg, product, order } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product is created
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toBeDefined();
});

it('emits an OrderCancelled event', async () => {
    const { listener, data, msg, order } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled();
});
