'use client';

import { FC } from 'react';
import { SessionProvider } from 'next-auth/react';
import {
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js';

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers: FC<ProviderProps> = ({ children }) => {
  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
    intent: 'capture',
    currency: 'USD',
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <SessionProvider>{children}</SessionProvider>
    </PayPalScriptProvider>
  );
};
