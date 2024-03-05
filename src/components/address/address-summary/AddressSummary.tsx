import { Address } from '@/interfaces';
import { FC } from 'react';

interface AddressSummaryProps {
  address: Address;
}

export const AddressSummary: FC<AddressSummaryProps> = ({ address }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>
    </>
  );
};
