import getCurrentUser from '@/app/actions/getCurrentUser';
import getProductById from '@/app/actions/getProductById';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import ProductDetails from './ProductDetails';

interface IParams {
    productId: string;
}

const ProductPage = async ({ params }: { params: IParams }) => {
    const product = await getProductById(params);
    const currentUser = await getCurrentUser();

    if (!product) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ProductDetails product={product} currentUser={currentUser} />
        </ClientOnly>
    );
};

export default ProductPage;
