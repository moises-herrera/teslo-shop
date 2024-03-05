import { FC } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  width: number;
  height: number;
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
}

export const ProductImage: FC<ProductImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  style
}) => {
  const localSrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';

  return (
    <Image
      src={localSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
    />
  );
};
