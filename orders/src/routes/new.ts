import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@prozaimlabs/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/orders',
    requireAuth,
    [
        body('name').not().isEmpty().withMessage('Product name is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (request: Request, response: Response) => {
        response.status(201).send({});
    }
);

export { router as createOrderRouter };
