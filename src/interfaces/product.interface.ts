export interface IProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: Size[];
  tags: string[];
  images: string[];
  // type: ValidType;
  gender: Gender;
  productImages: ProductImage[];
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
}

export interface ProductImage {
  id: string;
  url: string;
  productId?: string;
}

export type Gender = 'men' | 'women' | 'kid' | 'unisex';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type CategoryLabel = 'shirts' | 'pants' | 'hoodies' | 'hats';
