import getProducts from './actions/getProducts';
import FeaturedProductBanner from './components/FeaturedProductBanner';
import Wrapper from './components/Wrapper';
import ProductCard from './components/products/ProductCard';

export default async function Home() {
    const products = await getProducts();

    return (
        <main>
            <FeaturedProductBanner />
            <Wrapper>
                <div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px]">
                    <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
                        Supporting You in nuturing your preemie!
                    </div>
                    <div className="text-md md:text-xl">
                        Wheather its a cozy sleep pad, a comfy outfit or a
                        community preemie parents that you are looking we are
                        her for you.
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
                    {products && (
                        <>
                            {products.map((product) => (
                                <ProductCard product={product} />
                            ))}
                        </>
                    )}
                </div>
            </Wrapper>
        </main>
    );
}
