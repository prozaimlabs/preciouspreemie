import express, { Request, Response } from 'express';
import {
    BadRequestError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from '@prozaimlabs/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
import { Product } from '../models/products';
import { Order } from '../models/orders';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
    '/api/orders',
    requireAuth,
    [
        body('productId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Product id must be provided'),
    ],
    validateRequest,
    async (request: Request, response: Response) => {
        const { productId } = request.body;
        // find the product the user is trying to order in the database
        const product = await Product.findById(productId);
        if (!product) {
            throw new NotFoundError();
        }

        // make sure the product is not already reserved
        const isReserved = await product.isReserved();
        if (isReserved) {
            throw new BadRequestError('Product already reserved');
        }

        // calculate an expiration date for the product
        const expiration = new Date();
        expiration.setSeconds(
            expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
        );

        // build the order and save it to the database.
        const order = Order.build({
            userId: request.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            product,
        });
        await order.save();

        // publish order created event
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expireAt: order.expiresAt.toISOString(),
            product: {
                id: product.id,
                price: product.price,
            },
        });

        response.status(201).send(order);
    }
);

export { router as createOrderRouter };
