import { Listener, ProductCreatedEvent, Subjects } from '@prozaimlabs/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/products';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
    subject: Subjects.ProductCreated = Subjects.ProductCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
        const { id, name, price } = data;

        const product = Product.build({
            id,
            name,
            price,
        });
        await product.save();

        msg.ack();
    }
}
