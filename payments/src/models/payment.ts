import mongoose from 'mongoose';

interface PaymentAttrs {
    orderId: string;
    providerPaymentId: string;
    paymentProvider: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    providerPaymentId: string;
    paymentProvider: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        orderId: { type: String, required: true },
        providerPaymentId: { type: String, required: true },
        paymentProvider: { type: String, required: true },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
    'payment',
    paymentSchema
);

export { Payment };
