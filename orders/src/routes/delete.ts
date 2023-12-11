import express, { Request, Response } from 'express';
import {
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
} from '@prozaimlabs/common';
import { Order } from '../models/orders';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/orders/:id',
    requireAuth,
    async (request: Request, response: Response) => {
        const order = await Order.findById(request.params.id);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== request.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled;
        await order.save();

        // publish order cancelled event
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            product: {
                id: order.product.id,
            },
        });

        response.status(204).send(order);
    }
);

export { router as deleteOrderRouter };
