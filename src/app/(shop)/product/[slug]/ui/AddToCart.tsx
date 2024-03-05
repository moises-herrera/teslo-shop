'use client';

import { FC, useState } from 'react';
import { SizeSelector, QuantitySelector } from '@/components';
import { CartProduct, IProduct, Size } from '@/interfaces';
import { useCartStore } from '@/store';

interface AddToCartProps {
  product: IProduct;
}

export const AddToCart: FC<AddToCartProps> = ({ product }) => {
  const addProductToCart = useCartStore(
    ({ addProductToCart }) => addProductToCart
  );
  const [size, setSize] = useState<Size>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size,
      quantity,
    };

    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una talla*
        </span>
      )}

      {/* Selector de tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChange={setSize}
      />

      {/* Selector de cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      {/* Boton */}
      <button onClick={addToCart} type="button" className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};
