import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/products', (request: Request, response: Response) => {
    response.sendStatus(200);
});

export { router as createProductRouter };
