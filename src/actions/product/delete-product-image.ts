'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: string, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      error: 'No se pueden borrar imagenes locales',
    };
  }

  try {
    const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';
    await cloudinary.uploader.destroy(imageName);

    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/products/${deletedImage.product.slug}`);
    revalidatePath(`/product/${deletedImage.product.slug}`);
  } catch (error) {
    return {
      ok: false,
      error: 'Error al borrar la imagen',
    };
  }
};
