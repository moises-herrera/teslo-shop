'use server';

import { PayPalOrderStatusResponse } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPayPalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: 'No se pudo obtener token de verificacion',
    };
  }

  const paypalOrder = await verifyPayPalPayment(paypalTransactionId, authToken);

  if (!paypalOrder) {
    return {
      ok: false,
      message: 'Error al verificar el pago',
    };
  }

  const { status, purchase_units } = paypalOrder;
  const { invoice_id } = purchase_units[0];

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'Pago sin completar',
    };
  }

  try {
    const order = await prisma.order.update({
      where: {
        id: invoice_id,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    if (!order) {
      throw new Error('No se pudo verificar el pago');
    }

    revalidatePath(`/orders/${invoice_id}`);

    return {
      ok: true,
      message: 'Pago verificado',
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET_ID = process.env.PAYPAL_SECRET_ID;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_ID}`,
    'utf-8'
  ).toString('base64');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Authorization', `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
    cache: 'no-store',
  };

  try {
    const { access_token } = await fetch(oauth2Url, requestOptions).then(
      (response) => response.json()
    );

    return access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = process.env.PAYPAL_ORDERS_URL ?? '';

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    cache: 'no-store',
  };

  try {
    const result = await fetch(
      `${paypalOrderUrl}/${paypalTransactionId}`,
      requestOptions
    ).then((response) => response.json());

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
