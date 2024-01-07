import getCurrentUser from '../actions/getCurrentUser';
import getProducts from '../actions/getProducts';

import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/EmptyState';

const ReservationsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title="Uauthorized" subtitle="Please login" />
            </ClientOnly>
        );
    }

    const products = await getProducts();

    if (products.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No products found"
                    subtitle="Looks like you have no products"
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <></>
        </ClientOnly>
    );
};

export default ReservationsPage;
