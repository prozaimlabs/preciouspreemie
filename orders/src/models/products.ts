import mongoose from 'mongoose';
import { Order, OrderStatus } from './orders';

interface ProductAttrs {
    name: string;
    price: number;
}

export interface ProductDoc extends mongoose.Document {
    name: string;
    price: number;
    isReserved(): Promise<Boolean>;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
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

productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
};

productSchema.methods.isReserved = async function () {
    // this === the product document we just called the isReseved on
    const existingOrder = await Order.findOne({
        product: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });

    return !!existingOrder;
};

const Product = mongoose.model<ProductDoc, ProductModel>(
    'Product',
    productSchema
);

export { Product };
