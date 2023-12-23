import { Listener, ProductUpdatedEvent, Subjects } from '@prozaimlabs/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/products';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
    subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
        const product = await Product.findByEvent(data);

        if (!product) {
            throw new Error('Product not found');
        }

        const { name, price } = data;
        product.set({ name, price });
        await product.save();

        msg.ack();
    }
}
