import getCurrentUser from '../actions/getCurrentUser';
import getProducts from '../actions/getProducts';

import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/products/ProductCard';

const ProductsPage = async () => {
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
            <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
                {products && (
                    <>
                        {products.map((product) => (
                            <ProductCard product={product} />
                        ))}
                    </>
                )}
            </div>
        </ClientOnly>
    );
};

export default ProductsPage;
