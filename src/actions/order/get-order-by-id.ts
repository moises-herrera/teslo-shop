'use server';

import { auth } from '@/auth.config';
import { CartProduct } from '@/interfaces';
import prisma from '@/lib/prisma';

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: 'No hay una sesión activa',
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        items: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                images: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error('No se encontró la orden');
    }

    if (session.user.role === 'user' && session.user.id !== order.userId) {
      throw new Error('No tienes permisos para ver esta orden');
    }

    const orderItems: CartProduct[] = order.items.map(
      ({ product: { images, ...productData }, ...item }) => ({
        ...productData,
        ...item,
        image: images[0].url,
      })
    );
    const { countryId, ...address } = order.address ?? {};

    return {
      ok: true,
      order: {
        ...order,
        address: {
          ...address,
          country: countryId,
        },
        items: orderItems,
        itemsInOrder: orderItems.reduce(
          (total, { quantity }) => total + quantity,
          0
        ),
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
