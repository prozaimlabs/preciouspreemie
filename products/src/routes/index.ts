import express, { Request, Response } from 'express';
import { Product } from '../models/products';

const router = express.Router();

router.get('/api/products', async (request: Request, response: Response) => {
    const products = await Product.find({});

    response.send(products);
});

export { router as indexProductRouter };
