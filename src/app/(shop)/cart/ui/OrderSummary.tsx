'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';

export const OrderSummary = () => {
  const { itemsInCart, subTotal, tax, total } = useCartStore(
    ({ getSummaryInformation }) => getSummaryInformation()
  );
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">
        {itemsInCart} {itemsInCart === 1 ? 'artículo' : 'artículos'}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
