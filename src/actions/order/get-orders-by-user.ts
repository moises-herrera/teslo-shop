'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrdersByUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        address: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      orders,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las ordenes',
    };
  }
};
