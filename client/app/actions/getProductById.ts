import buildRequest from './buildRequest';

interface IParams {
    productId?: string;
}

export default async function getProductById(params: IParams) {
    try {
        const { productId } = params;

        const product = await buildRequest().get(`/api/products/${productId}`);

        if (!product) {
            return null;
        }

        return { product };
    } catch (error: any) {
        throw new Error(error);
    }
}
