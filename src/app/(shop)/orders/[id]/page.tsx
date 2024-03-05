import { getOrderById } from '@/actions';
import { PayPalButton, ProductsList, Title } from '@/components';
import { AddressSummary } from '@/components/address';
import { OrderInfo, OrderStatus } from '@/components/order';
import { Address, OrderSummary } from '@/interfaces';
import clsx from 'clsx';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = params;
  const { ok, order } = await getOrderById(id);

  if (!ok || !order) {
    redirect('/');
  }

  const address = order.address as Address;
  const orderSummary: OrderSummary = {
    subTotal: order.subTotal,
    tax: order.tax,
    total: order.total,
    itemsInCart: order.itemsInOrder,
  };

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order.isPaid} />

            {/* Items */}
            <ProductsList products={order.items} />
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <AddressSummary address={address} />

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <OrderInfo summary={orderSummary} />

            <div className="mt-5 mb-2 w-full">
              {order.isPaid ? (
                <OrderStatus isPaid={order.isPaid} />
              ) : (
                <PayPalButton orderId={order.id} amount={order.total} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
