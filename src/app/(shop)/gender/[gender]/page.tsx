export const revalidate = 60;

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { Gender } from '@/interfaces';
import { redirect } from 'next/navigation';

interface GenderPageProps {
  searchParams: {
    page?: string;
  };
  params: {
    gender: Gender;
  };
}

export default async function GenderPage({
  searchParams,
  params,
}: GenderPageProps) {
  const { gender } = params;
  const label: Record<Gender, string> = {
    men: 'Hombres',
    women: 'Mujeres',
    kid: 'Niños',
    unisex: 'Todos',
  };

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  return (
    <>
      <Title
        title={`Artículos para ${label[gender]}`}
        subtitle="Productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
