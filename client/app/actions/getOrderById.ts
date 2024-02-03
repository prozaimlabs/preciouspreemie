import { sanitizeOrderFromBackend } from '../api/sanitizers/orders';
import buildRequest from './buildRequest';

interface IParam {
    orderId?: string;
}

export default async function getOrderById(params: IParam) {
    try {
        console.log(params);
        const { orderId } = params;

        const response = await buildRequest().get(`/api/orders/${orderId}`);
        const order = sanitizeOrderFromBackend(response.data);

        if (!order) {
            return null;
        }

        return order;
    } catch (error: any) {
        throw new Error(error);
    }
}
