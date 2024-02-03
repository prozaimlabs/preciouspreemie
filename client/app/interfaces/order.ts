import { OrderStatus } from '@prozaimlabs/common';
import { Product, ProductBackend } from './product';

export interface OrderBackend {
    userId: string;
    status: OrderStatus;
    expiresAt: number;
    product: ProductBackend;
    version?: number;
    id: string;
}

export interface Order {
    userId: string;
    status: OrderStatus;
    expiresAt: number;
    product: Product;
    version?: number;
    id: string;
}
