import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@prozaimlabs/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '../../../models/orders';

const setup = async () => {
    // create an instance of a listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create a fake product
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 200,
        userId: 'asdf',
        version: 0,
    });
    await order.save();

    // create a fake data event
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        product: {
            id: 'asd',
        },
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
    const { listener, data, msg, order } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product is created
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack is called
    expect(msg.ack).toHaveBeenCalled();
});
