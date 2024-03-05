'use client';

import React, { FC, useState } from 'react';
import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './slideshow.css';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ProductImage } from '..';

interface ProductSlideshowProps {
  images: string[];
  title: string;
  className?: string;
}

export const ProductSlideshow: FC<ProductSlideshowProps> = ({
  images,
  title,
  className,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

  return (
    <div className={className}>
      <Swiper
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2500,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {images.map((imageSrc) => (
          <SwiperSlide key={imageSrc}>
            <ProductImage
              width={1024}
              height={800}
              src={imageSrc}
              alt={title}
              className="rounded-lg object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images.map((imageSrc) => (
          <SwiperSlide key={imageSrc}>
            <ProductImage
              width={300}
              height={300}
              src={imageSrc}
              alt={title}
              className="rounded-lg object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
