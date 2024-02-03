import { sanitizeProductFromBackend } from '../api/sanitizers/products';
import buildRequest from './buildRequest';

interface IParams {
    productId?: string;
}

export default async function getProductById(params: IParams) {
    try {
        const { productId } = params;

        const response = await buildRequest().get(`/api/products/${productId}`);
        const product = sanitizeProductFromBackend(response.data);

        if (!product) {
            return null;
        }

        return product;
    } catch (error: any) {
        throw new Error(error);
    }
}
