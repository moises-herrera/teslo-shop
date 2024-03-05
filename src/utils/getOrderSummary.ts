import { CartProduct, OrderSummary } from '@/interfaces';

export const getOrderSummary = (products: CartProduct[]): OrderSummary => {
  const subTotal = products.reduce(
    (total, { price, quantity }) => total + price * quantity,
    0
  );
  const tax = subTotal * 0.15;
  const total = subTotal + tax;
  const itemsInCart = products.reduce(
    (total, { quantity }) => total + quantity,
    0
  );

  return {
    subTotal,
    tax,
    total,
    itemsInCart,
  };
};
