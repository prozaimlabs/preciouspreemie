import express, { Request, Response } from 'express';
import {
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
} from '@prozaimlabs/common';
import { Order } from '../models/orders';

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

        response.status(204).send(order);
    }
);

export { router as deleteOrderRouter };
