import { sanitizeProductsFromBackend } from '../api/sanitizers/products';
import buildRequest from './buildRequest';

export default async function getProducts() {
    try {
        const response = await buildRequest().get(`/api/products/`);
        const products = sanitizeProductsFromBackend(response.data);

        if (!products) {
            return [];
        }

        return products;
    } catch (error: any) {
        throw new Error(error);
    }
}
