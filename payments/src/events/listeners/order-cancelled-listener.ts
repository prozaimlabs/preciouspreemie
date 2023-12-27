import {
    Listener,
    OrderCancelledEvent,
    OrderStatus,
    Subjects,
} from '@prozaimlabs/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // find the order that is cancelled
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        });

        // If no order is found, throw an error
        if (!order) {
            throw new Error('Order not found');
        }

        // Mark the order as cancelled
        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        //acknowledge the message
        msg.ack();
    }
}
