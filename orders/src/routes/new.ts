import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@prozaimlabs/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';

const router = express.Router();

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
        response.status(201).send({});
    }
);

export { router as createOrderRouter };
