import express, { Request, Response } from 'express';
import { Order } from '../models/orders';

const router = express.Router();

router.get('/api/orders', async (request: Request, response: Response) => {
    const orders = await Order.find({
        userId: request.currentUser!.id,
    }).populate('product');

    response.send(orders);
});

export { router as indexOrderRouter };
