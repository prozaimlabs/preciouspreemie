import mongoose from 'mongoose';
import { Order, OrderStatus } from './orders';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProductAttrs {
    id: string;
    name: string;
    price: number;
}

export interface ProductDoc extends mongoose.Document {
    name: string;
    price: number;
    version: number;
    isReserved(): Promise<Boolean>;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<ProductDoc | null>;
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

productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product({
        _id: attrs.id,
        name: attrs.name,
        price: attrs.price,
    });
};

productSchema.statics.findByEvent = (event: {
    id: string;
    version: number;
}) => {
    return Product.findOne({
        _id: event.id,
        version: event.version - 1,
    });
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
