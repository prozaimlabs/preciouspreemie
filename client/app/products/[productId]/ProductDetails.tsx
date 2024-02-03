'use client';
import React, { useCallback, useState } from 'react';
import { IoMdHeartEmpty } from 'react-icons/io';
import Wrapper from '@/app/components/Wrapper';
import { CurrentUser } from '@/app/interfaces/currentUser';
import { Product } from '@/app/interfaces/product';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductImagesCarousel, {
    ProductImagesCarouselProps,
} from '@/app/components/products/ProductImagesCarousel';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ProductDetailsProps {
    product: Product;
    currentUser?: CurrentUser | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
    product,
    currentUser,
}) => {
    const router = useRouter();

    const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

    const notify = () => {
        toast.success('Success. Check your order!', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        });
    };

    const createOrder = () => {
        const data = { productId: product.id };
        console.log('Creating order...', data);

        axios
            .post('/api/orders', data)
            .then((response) => {
                console.log('Order Created response: ', response.data);
                notify();
                router.push(`/orders/${response.data.id}`);
            })
            .catch((error) => {
                setBackendErrors(error.response.data.errors);
            });
    };

    return (
        <div className="w-full md:py-20">
            <ToastContainer />
            <Wrapper>
                <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
                    {/* left column start */}
                    <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
                        <ProductImagesCarousel />
                    </div>
                    {/* left column end */}

                    {/* right column start */}
                    <div className="flex-[1] py-3">
                        {/* PRODUCT TITLE */}
                        <div className="text-[34px] font-semibold mb-2 leading-tight">
                            {product.name}
                        </div>

                        {/* PRODUCT SUBTITLE */}
                        <div className="text-lg font-semibold mb-5">
                            product
                        </div>

                        {/* PRODUCT PRICE */}
                        <div className="flex items-center">
                            <p className="mr-2 text-lg font-semibold">
                                Price : ${product.price}
                            </p>
                            {/* {product.price && (
                                <>
                                    <p className="text-base  font-medium line-through">
                                        &#8377;{product.price}
                                    </p>
                                    <p className="ml-auto text-base font-medium text-green-500">
                                        {getDiscountedPricePercentage(
                                            product.price,
                                            20
                                        )}
                                        % off
                                    </p>
                                </>
                            )} */}
                        </div>

                        <div className="text-md font-medium text-black/[0.5]">
                            Taxes included
                        </div>
                        <div className="text-md font-medium text-black/[0.5] mb-20">
                            {`(Also includes all applicable duties)`}
                        </div>

                        {/* PRODUCT SIZE RANGE START */}
                        <div className="mb-10">
                            {/* HEADING START */}
                            <div className="flex justify-between mb-2">
                                <div className="text-md font-semibold">
                                    Select Size
                                </div>
                                <div className="text-md font-medium text-black/[0.5] cursor-pointer">
                                    Select Guide
                                </div>
                            </div>
                            {/* HEADING END */}

                            {/* SIZE START */}
                            {/* <div
                                id="sizesGrid"
                                className="grid grid-cols-3 gap-2"
                            >
                                {p.size.data.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`border rounded-md text-center py-3 font-medium ${
                                            item.enabled
                                                ? 'hover:border-black cursor-pointer'
                                                : 'cursor-not-allowed bg-black/[0.1] opacity-50'
                                        } ${
                                            selectedSize === item.size
                                                ? 'border-black'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setSelectedSize(item.size);
                                            setShowError(false);
                                        }}
                                    >
                                        {item.size}
                                    </div>
                                ))}
                            </div> */}
                            {/* SIZE END */}

                            {/* SHOW ERROR START */}
                            {backendErrors && (
                                <div className="bg-rose-200 rounded px-1 border-red-800">
                                    <h4 className="text-red-800 font-semibold">
                                        Error!
                                    </h4>
                                    <ul className="my-0 text-red-800">
                                        {backendErrors.map((error) => (
                                            <li key={error.message}>
                                                {error.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* SHOW ERROR END */}
                        </div>
                        {/* PRODUCT SIZE RANGE END */}

                        {/* ADD TO CART BUTTON START */}
                        <button
                            className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
                            onClick={createOrder}
                        >
                            Purchase
                        </button>
                        {/* ADD TO CART BUTTON END */}

                        {/* WISHLIST BUTTON START */}
                        <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10">
                            Wishlist
                            <IoMdHeartEmpty size={20} />
                        </button>
                        {/* WHISHLIST BUTTON END */}

                        <div>
                            <div className="text-lg font-bold mb-5">
                                Product Details
                            </div>
                            <div className="markdown text-md mb-5">
                                <ReactMarkdown>Test description</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                    {/* right column end */}
                </div>
            </Wrapper>
        </div>
    );
};

export default ProductDetails;
