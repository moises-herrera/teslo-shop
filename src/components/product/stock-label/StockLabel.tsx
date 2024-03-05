'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { getStockBySlug } from '@/actions';
import { titleFont } from '@/config/fonts';

interface StockLabelProps {
  slug: string;
}

export const StockLabel: FC<StockLabelProps> = ({ slug }) => {
  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStock = useCallback(async () => {
    const stock = await getStockBySlug(slug);
    setStock(stock);
    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    getStock();
  }, [getStock]);

  return (
    <>
      {!isLoading ? (
        <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>
          Stock: {stock}
        </h1>
      ) : (
        <h1
          className={`${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse`}
        >
          &nbsp;
        </h1>
      )}
    </>
  );
};
