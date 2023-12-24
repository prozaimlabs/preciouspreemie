import { Listener, OrderCreatedEvent, Subjects } from '@prozaimlabs/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/products';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // find the product that the order is reserving
        const product = await Product.findById(data.product.id);

        // If no product is found, throw an error
        if (!product) {
            throw new Error('Product not found');
        }

        // Mark the product as reserved by setting its orderId property
        product.set({ orderId: data.id });

        //save the product
        await product.save();
        await new ProductUpdatedPublisher(this.client).publish({
            id: product.id,
            price: product.price,
            name: product.name,
            userId: product.userId,
            orderId: product.orderId,
            version: product.version,
        });

        //acknowledge the message
        msg.ack();
    }
}
