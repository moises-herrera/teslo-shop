'use server';

import { auth } from '@/auth.config';

export const getPaginatedUsers = async () => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'Debe de ser un usuario administrador' };
  }

  try {
    const users = await prisma?.user.findMany({
      orderBy: { name: 'desc' },
    });

    return { ok: true, users };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message ?? 'Error al obtener los usuarios',
    };
  }
};
