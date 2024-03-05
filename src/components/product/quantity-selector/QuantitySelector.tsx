'use client';

import { FC } from 'react';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (value: number) => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
}) => {
  const onValueChange = (value: number) => {
    if (quantity + value < 1) return;
    onQuantityChange(quantity + value);
  };

  return (
    <div className="flex items-center">
      <button onClick={() => onValueChange(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded border border-gray-200">
        {quantity}
      </span>

      <button onClick={() => onValueChange(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
