'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getPaginatedOrders = async () => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
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
