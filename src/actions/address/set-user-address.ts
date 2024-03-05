'use server';

import { Address } from '@/interfaces';
import prisma from '@/lib/prisma';

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);
    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: 'Error setting user address',
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    const { country, ...data } = address;

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: {
          ...data,
          countryId: country,
          userId,
        },
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        userId,
      },
      data: {
        ...data,
        countryId: country,
      },
    });

    return updatedAddress;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating or replacing address');
  }
};