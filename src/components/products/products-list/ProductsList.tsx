import { CartProduct } from '@/interfaces';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import { FC } from 'react';

interface ProductsListProps {
  products: CartProduct[];
}

export const ProductsList: FC<ProductsListProps> = ({ products }) => {
  return (
    <>
      {products.map(({ slug, image, title, price, quantity, size }) => (
        <div key={`${slug}-${size}`} className="flex mb-5">
          <Image
            src={`/products/${image}`}
            width={100}
            height={100}
            style={{
              objectFit: 'contain',
            }}
            alt={title}
            className="mr-5 rounded"
          />

          <div>
            <p>
              {size} - {title}
            </p>
            <p>
              ${price} x {quantity}
            </p>
            <p className="font-bold">{currencyFormat(price * quantity)}</p>
          </div>
        </div>
      ))}
    </>
  );
};
