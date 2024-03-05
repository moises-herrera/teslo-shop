'use server';

import { IProduct, ProductImage } from '@/interfaces';
import prisma from '@/lib/prisma';

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        images: {
          select: {
            url: true,
            id: true,
          },
        },
      },
      where: {
        slug,
      },
    });

    if (!product) return null;

    return {
      ...product,
      productImages: product?.images as unknown as ProductImage[] || [],
      images: product?.images.map(({ url }) => url) || [],
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener product por slug');
  }
};
