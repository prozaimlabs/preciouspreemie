import express, { Request, Response } from 'express';
import { NotFoundError } from '@prozaimlabs/common';

const router = express.Router();

router.get('/api/orders/:id', async (request: Request, response: Response) => {
    response.send({});
});

export { router as showOrderRouter };
