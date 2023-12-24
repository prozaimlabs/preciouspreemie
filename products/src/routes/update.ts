import express, { Request, Response } from 'express';
import { Product } from '../models/products';
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@prozaimlabs/common';
import { body } from 'express-validator';
import { ProductUpdatedPublisher } from '../events/publishers/product-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/products/:id',
    requireAuth,
    [
        body('name').not().isEmpty().withMessage('Product name is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price is required and must be greater than 0'),
    ],
    validateRequest,
    async (request: Request, response: Response) => {
        const product = await Product.findById(request.params.id);

        if (!product) {
            throw new NotFoundError();
        }

        if (product.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket');
        }

        if (product.userId !== request.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        product.set({
            name: request.body.name,
            price: request.body.price,
        });
        await product.save();

        new ProductUpdatedPublisher(natsWrapper.client).publish({
            id: product.id,
            name: product.name,
            price: product.price,
            userId: product.userId,
            version: product.version,
        });

        response.send(product);
    }
);

export { router as updateProductRouter };
