'use client';

import { ProductsList } from '@/components';
import { useCartStore } from '@/store';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {
  const [loaded, setIsLoaded] = useState<boolean>(false);
  const productsInCart = useCartStore(({ cart }) => cart);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return <ProductsList products={productsInCart} />;
};
