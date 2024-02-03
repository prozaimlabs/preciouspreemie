import { Order, OrderBackend } from '@/app/interfaces/order';

export const sanitizeOrdersFromBackend = (data: OrderBackend[]) => {
    return data.map((order) => sanitizeOrderFromBackend(order));
};

export const sanitizeOrderFromBackend = (data: Order) => {
    return {
        id: data.id,
        status: data.status,
        expiresAt: data.expiresAt,
        product: data.product,
        userId: data.userId,
    };
};
