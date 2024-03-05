'use server';

export const getCategories = async () => {
  try {
    const categories = await prisma?.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return { ok: true, categories: categories ?? [] };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? 'Error al obtener categorias',
      categories: [],
    };
  }
};
