import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError } from '@prozaimlabs/common';
import { Order } from '../models/orders';

const router = express.Router();

router.get('/api/orders/:id', async (request: Request, response: Response) => {
    const order = await Order.findById(request.params.id).populate('product');

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== request.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    response.send(order);
});

export { router as showOrderRouter };
