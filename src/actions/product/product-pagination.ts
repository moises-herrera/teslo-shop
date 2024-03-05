'use server';

import { IProduct } from '@/interfaces';
import prisma from '@/lib/prisma';
import { Gender } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

interface PaginatedProducts {
  products: IProduct[];
  currentPage: number;
  totalPages: number;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions): Promise<PaginatedProducts> => {
  try {
    if (isNaN(Number(page)) || page < 1) page = 1;
    if (isNaN(Number(take)) || take < 1) take = 12;

    // 1. Obtener productos
    const products = await prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      include: {
        images: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        gender,
      },
    });

    // 2. Obtener el total de paginas
    const totalCount = await prisma.product.count({
      where: {
        gender,
      },
    });
    const totalPages = Math.ceil(totalCount / take);

    return {
      products: products.map(({ images, ...product }) => ({
        ...product,
        productImages: [], 
        images: images.map(({ url }) => url),
      })),
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    throw new Error('No se pudieron cargar los productos');
  }
};
