'use client';
import { Product } from '@/app/interfaces/product';
import { getDiscountedPricePercentage } from '@/app/utils/helper';
import Link from 'next/link';
import React from 'react';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link href="/products/[productId]" as={`/products/${product.id}`}>
            <img
                className="w-full"
                src="/images/baby_cloth.jpg"
                alt="product image"
            />
            <div className="p-4 text-black/[0.9]">
                <h2 className="text-lg font-medium">{product.name}</h2>
                <div className="flex items-center text-black/[0.5]">
                    <p className="mr-2 text-lg font-semibold">
                        &#8344{product.price}
                    </p>

                    {20 && (
                        <>
                            <p className="text-base  font-medium line-through">
                                &#8378;{'20'}
                            </p>
                            <p className="ml-auto text-base font-medium text-green-500">
                                {getDiscountedPricePercentage(
                                    product.price,
                                    20
                                )}
                                % off
                            </p>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
