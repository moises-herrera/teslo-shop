'use client';

import { FC } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';
import { paypalCheckPayment, setTransactionId } from '@/actions';

interface PayPalButtonProps {
  orderId: string;
  amount: number;
}

export const PayPalButton: FC<PayPalButtonProps> = ({ orderId, amount }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse mb-16 space-y-2">
        <div className="w-full h-10 bg-gray-300 rounded" />
        <div className="w-full h-10 bg-gray-300 rounded" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
            currency_code: 'USD',
          },
        },
      ],
    });

    // Save the transactionId to the database
    const { ok } = await setTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error('No se pudo actualiar la orden');
    }

    return transactionId;
  };

  const onApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> => {
    const details = await actions.order?.capture();
    if (!details) return;

    await paypalCheckPayment(details.id as string);
  };

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};
