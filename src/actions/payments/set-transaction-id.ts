'use server';

import prisma from '@/lib/prisma';

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      throw new Error(`No se encontro una orden con el id ${orderId}`);
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo actualiar el id de la transacción',
    };
  }
};
