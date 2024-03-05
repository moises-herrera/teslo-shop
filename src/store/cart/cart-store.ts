import { create } from 'zustand';
import type { CartProduct, OrderSummary } from '@/interfaces';
import { persist } from 'zustand/middleware';

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInformation: () => OrderSummary;
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, { quantity }) => total + quantity, 0);
      },
      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (total, { price, quantity }) => total + price * quantity,
          0
        );
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce(
          (total, { quantity }) => total + quantity,
          0
        );

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const isProductInCart = cart.some(
          ({ id, size }) => id === product.id && size === product.size
        );

        if (!isProductInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + 1 };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      removeProduct: ({ id, size }) => {
        set(({ cart, ...state }) => ({
          ...state,
          cart: cart.filter((item) => item.id !== id || item.size !== size),
        }));
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);
