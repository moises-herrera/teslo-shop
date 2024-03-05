export const revalidate = 604800;

import { getProductBySlug } from '@/actions';
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  StockLabel,
} from '@/components';
import { titleFont } from '@/config/fonts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AddToCart } from './ui/AddToCart';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const slug = params.slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [`/product/${product.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>

      {/* Details */}
      <div className="col-span-1 px-5">
        <StockLabel slug={slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} />

        {/* Descripcion */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
