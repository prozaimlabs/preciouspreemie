import getCurrentUser from '@/app/actions/getCurrentUser';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import OrderDetails from './OrderDetails';
import getOrderById from '@/app/actions/getOrderById';

interface IParam {
    orderId: string;
}

const OrderPage = async ({ params }: { params: IParam }) => {
    const currentUser = await getCurrentUser();
    const order = await getOrderById(params);

    if (!order) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    if (order.userId !== currentUser?.id) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized access"
                    subtitle="It seems this order does not belong to you!"
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <OrderDetails order={order} currentUser={currentUser} />
        </ClientOnly>
    );
};

export default OrderPage;
