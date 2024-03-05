import { FC } from 'react';
import { Size } from '@/interfaces';
import clsx from 'clsx';

interface SizeSelectorProps {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeChange: (size: Size) => void;
}

export const SizeSelector: FC<SizeSelectorProps> = ({
  selectedSize,
  availableSizes,
  onSizeChange,
}) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>

      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeChange(size)}
            className={clsx('mx-2 hover:underline text-lg', {
              underline: size === selectedSize,
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
