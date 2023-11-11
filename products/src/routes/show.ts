import express, { Request, Response } from 'express';
import { Product } from '../models/products';
import { NotFoundError } from '@prozaimlabs/common';

const router = express.Router();

router.get(
    '/api/products/:id',
    async (request: Request, response: Response) => {
        const product = await Product.findById(request.params.id);

        if (!product) {
            throw new NotFoundError();
        }

        response.send(product);
    }
);

export { router as showProductRouter };
