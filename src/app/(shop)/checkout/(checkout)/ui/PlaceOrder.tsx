'use client';

import { placeOrder } from '@/actions';
import { AddressSummary } from '@/components/address';
import { OrderInfo } from '@/components/order';
import { useAddressStore, useCartStore } from '@/store';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const address = useAddressStore(({ address }) => address);

  const orderSummary = useCartStore(({ getSummaryInformation }) =>
    getSummaryInformation()
  );
  const cart = useCartStore(({ cart }) => cart);
  const clearCart = useCartStore(({ clearCart }) => clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map(({ id, quantity, size }) => ({
      productId: id,
      quantity,
      size,
    }));
    const response = await placeOrder(productsToOrder, address);

    if (!response.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(response.message);
      return;
    }

    // Limpiar el carrito
    clearCart();
    router.replace(`/orders/${response.order?.id}`);
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <AddressSummary address={address} />

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

      <OrderInfo summary={orderSummary} />

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            Al hacer click en &quot;Colocar orden&quot;, aceptar nuestros{' '}
            <a href="" className="underline">
              términos y condiciones
            </a>{' '}
            y{' '}
            <a href="" className="underline">
              política de privacidad
            </a>
          </span>
        </p>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="button"
          onClick={onPlaceOrder}
          className={clsx({
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder,
          })}
          disabled={isPlacingOrder}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
