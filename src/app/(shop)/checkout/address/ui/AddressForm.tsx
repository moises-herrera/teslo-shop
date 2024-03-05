'use client';

import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { Address, Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import { deleteUserAddress, setUserAddress } from '@/actions';
import { useSession } from 'next-auth/react';
import './AddressForm.css';
import { useRouter } from 'next/navigation';

type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
};

interface AddressFormProps {
  countries: Country[];
  userStoredAddress?: Partial<Address>;
}

export const AddressForm: FC<AddressFormProps> = ({
  countries,
  userStoredAddress = {},
}) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      ...(userStoredAddress as FormInputs),
      rememberAddress: false,
    },
  });

  const { data: session } = useSession({
    required: true,
  });

  const setAddress = useAddressStore(({ setAddress }) => setAddress);
  const address = useAddressStore(({ address }) => address);

  useEffect(() => {
    if (address.firstName) {
      reset(address);
    }
  }, [address, reset]);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const { rememberAddress, ...address } = data;
    setAddress(address);

    const sendAddress = async () => {
      if (!session) return;
      const userId = session.user.id;

      if (rememberAddress) {
        await setUserAddress(address, userId);
        return;
      } else {
        await deleteUserAddress(userId);
      }
    };

    sendAddress().then(() => router.push('/checkout'));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
    >
      <div className="form-control">
        <span>Nombres</span>
        <input
          type="text"
          className="form-field"
          {...register('firstName', { required: true })}
        />
      </div>

      <div className="form-control">
        <span>Apellidos</span>
        <input
          type="text"
          className="form-field"
          {...register('lastName', { required: true })}
        />
      </div>

      <div className="form-control">
        <span>Dirección</span>
        <input
          type="text"
          className="form-field"
          {...register('address', { required: true })}
        />
      </div>

      <div className="form-control">
        <span>Dirección 2 (opcional)</span>
        <input type="text" className="form-field" {...register('address2')} />
      </div>

      <div className="form-control">
        <span>Código postal</span>
        <input
          type="text"
          className="form-field"
          {...register('postalCode', { required: true })}
        />
      </div>

      <div className="form-control">
        <span>Ciudad</span>
        <input
          type="text"
          className="form-field"
          {...register('city', { required: true })}
        />
      </div>

      <div className="form-control">
        <span>País</span>
        <select
          className="form-field"
          {...register('country', { required: true })}
        >
          <option value="">[ Seleccione ]</option>
          {countries.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <span>Teléfono</span>
        <input
          type="text"
          className="form-field"
          {...register('phone', { required: true })}
        />
      </div>

      <div className="form-control sm:mt-1">
        <div className="inline-flex items-center mb-10">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              {...register('rememberAddress')}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </label>

          <span>¿Recordar dirección?</span>
        </div>

        <button
          type="submit"
          className={clsx({ 'btn-primary': isValid, 'btn-disabled': !isValid })}
          disabled={!isValid}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};
