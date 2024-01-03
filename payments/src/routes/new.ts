import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from '@prozaimlabs/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/orders';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentProvider } from '../utils/payment-provider';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/payments',
    requireAuth,
    [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
    validateRequest,
    async (request: Request, response: Response) => {
        const { orderId, token } = request.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== request.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for already cancelled order');
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token,
        });

        const payment = Payment.build({
            orderId,
            providerPaymentId: charge.id,
            paymentProvider: PaymentProvider.STRIPE,
        });
        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            providerPaymentId: payment.providerPaymentId,
            paymentProvider: PaymentProvider.STRIPE,
        });
        console.log('Payment Id', payment.providerPaymentId);
        response.status(201).send({ id: payment.id });
    }
);

export { router as CreateChargeRouter };
