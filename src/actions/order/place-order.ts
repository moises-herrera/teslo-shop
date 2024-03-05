'use server';

import { auth } from '@/auth.config';
import type { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  orderProducts: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verificar sesion de usuario
  if (!userId) {
    return {
      ok: false,
      message: 'No hay sesion de usuario',
    };
  }

  // Obtener la informacion de los productos
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: orderProducts.map(({ productId }) => productId),
      },
    },
  });

  // Calcular los montos
  const itemsInOrder = orderProducts.reduce(
    (count, { quantity }) => count + quantity,
    0
  );

  // Total, subtotal, tax
  const { subTotal, tax, total } = orderProducts.reduce(
    (totals, { productId, quantity }) => {
      const product = products.find(({ id }) => id === productId);
      if (!product) throw new Error(`Producto ${productId} no encontrado`);

      const subTotal = product.price * quantity;
      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  // Crear la transaccion
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        const productQuantity = orderProducts
          .filter(({ productId }) => productId === product.id)
          .reduce((total, { quantity }) => total + quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`Producto ${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar valores negativos en las existencias = no hay stock
      updatedProducts.forEach(({ title, inStock }) => {
        if (inStock < 0) {
          throw new Error(`${title} no tiene inventario suficiente`);
        }
      });

      // 2. Crear la orden - Encabezado - Detalle
      const order = await tx.order.create({
        data: {
          subTotal,
          tax,
          total,
          itemsInOrder,
          userId,
          items: {
            createMany: {
              data: orderProducts.map((product) => ({
                ...product,
                price:
                  products.find(({ id }) => id === product.productId)?.price ??
                  0,
              })),
            },
          },
        },
      });

      // 3. Crear la direccion de la orden
      const { country, ...orderAddressData } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...orderAddressData,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        updatedProducts,
        order,
        orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
