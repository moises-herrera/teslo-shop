import { FC } from 'react';
import { OrderSummary } from '@/interfaces';
import { currencyFormat } from '@/utils';

interface OrderInfoProps {
  summary: OrderSummary;
}

export const OrderInfo: FC<OrderInfoProps> = ({
  summary: { itemsInCart, subTotal, tax, total },
}) => {
  return (
    <>
      <h2 className="text-2xl mb-2">Resumen de orden</h2>

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
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>
    </>
  );
};
