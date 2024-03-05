'use server';

import { auth } from '@/auth.config';
import { Role } from '@/interfaces';
import { revalidatePath } from 'next/cache';

export const changeUserRole = async (userId: string, role: Role) => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'Debe de ser un usuario administrador' };
  }

  try {
    const user = await prisma?.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    });

    revalidatePath('/admin/users');

    return {
      ok: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      ok: false,
      error: error.message ?? 'Error al cambiar el rol del usuario',
    };
  }
};
