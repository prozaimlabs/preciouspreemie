import { Listener, OrderCreatedEvent, Subjects } from '@prozaimlabs/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.product.price,
            userId: data.userId,
            version: data.version,
            status: data.status,
        });
        await order.save();

        //acknowledge the message
        msg.ack();
    }
}
