'use client';

import { ProductImage, QuantitySelector } from '@/components';
import { useCartStore } from '@/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {
  const [loaded, setIsLoaded] = useState<boolean>(false);
  const productsInCart = useCartStore(({ cart }) => cart);
  const updateProductQuantity = useCartStore(
    ({ updateProductQuantity }) => updateProductQuantity
  );
  const removeProduct = useCartStore(({ removeProduct }) => removeProduct);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      {productsInCart.map(
        ({ slug, image, title, price, quantity, size }, index, array) => (
          <div key={`${slug}-${size}`} className="flex mb-5">
            <ProductImage
              src={image}
              width={100}
              height={100}
              style={{
                objectFit: 'contain',
              }}
              alt={title}
              className="mr-5 rounded"
            />

            <div>
              <Link
                className="hover:underline cursor-pointer"
                href={`/product/${slug}`}
              >
                {size} - {title}
              </Link>
              <p>{price}</p>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={(quantity) =>
                  updateProductQuantity(array[index], quantity)
                }
              />

              <button
                onClick={() => removeProduct(array[index])}
                type="button"
                className="underline mt-3"
              >
                Remover
              </button>
            </div>
          </div>
        )
      )}
    </>
  );
};
