import { Product, ProductBackend } from '@/app/interfaces/product';

export const sanitizeProductsFromBackend = (data: ProductBackend[]) => {
    return data.map((product) => sanitizeProductFromBackend(product));
};

export const sanitizeProductFromBackend = (data: Product) => {
    return {
        id: data.id,
        name: data.name,
        price: data.price,
        userId: data.userId,
    };
};
