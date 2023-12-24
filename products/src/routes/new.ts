import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@prozaimlabs/common';
import { body } from 'express-validator';
import { Product } from '../models/products';
import { ProductCreatedPublisher } from '../events/publishers/product-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/products',
    requireAuth,
    [
        body('name').not().isEmpty().withMessage('Product name is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (request: Request, response: Response) => {
        const { name, price } = request.body;

        const product = Product.build({
            name,
            price,
            userId: request.currentUser!.id,
        });
        await product.save();

        new ProductCreatedPublisher(natsWrapper.client).publish({
            id: product.id,
            name: product.name,
            price: product.price,
            userId: product.userId,
            version: product.version,
        });

        response.status(201).send(product);
    }
);

export { router as createProductRouter };
