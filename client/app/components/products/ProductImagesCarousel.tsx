'use client';

import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export interface ProductImagesCarouselProps {
    images: {
        url: string;
        name: string;
    };
}

const ProductImagesCarousel = () => {
    return (
        <div className="text-white text-[20px] w-full max-w-[1360px] mx-auto sticky top-[50px]">
            <Carousel
                infiniteLoop={true}
                showIndicators={false}
                showStatus={false}
                thumbWidth={60}
                className="productCarousel"
            >
                <img src="/images/baby_cloth.jpg" alt="product image" />
                <img src="/images/baby_cloth.jpg" alt="product image" />
                {/* {images?.map((img) => (
                    <img key={img.url} src={img.url} alt={img.name} />
                ))} */}
                {/*<img src="/p3.png" />
                <img src="/p4.png" />
                <img src="/p5.png" />
                <img src="/p6.png" />
                <img src="/p7.png" /> */}
            </Carousel>
        </div>
    );
};

export default ProductImagesCarousel;
