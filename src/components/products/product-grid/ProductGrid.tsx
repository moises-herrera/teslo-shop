import { IProduct } from '@/interfaces';
import { FC } from 'react';
import { ProductGridItem } from '..';

interface Props {
  products: IProduct[];
}

export const ProductGrid: FC<Props> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
      {products.map((product) => (
        <ProductGridItem key={product.slug} product={product} />
      ))}
    </div>
  );
};
