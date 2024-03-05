'use client';

import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './slideshow.css';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import Image from 'next/image';

interface ProductMobileSlideshowProps {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow: FC<ProductMobileSlideshowProps> = ({
  images,
  title,
  className,
}) => {
  return (
    <div className={className}>
      <Swiper
        style={{ width: '100vw', height: '500px' }}
        pagination
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {images.map((imageSrc) => (
          <SwiperSlide key={imageSrc}>
            <Image
              width={600}
              height={500}
              src={`/products/${imageSrc}`}
              alt={title}
              className="object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
