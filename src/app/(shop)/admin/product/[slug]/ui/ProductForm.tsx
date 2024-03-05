'use client';

import { createUpdateProduct, deleteProductImage } from '@/actions';
import { ProductImage } from '@/components';
import type { Category, IProduct, Size } from '@/interfaces';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface Props {
  product: Partial<IProduct>;
  categories: Category[];
}

const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: Size[];
  tags: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  watch('sizes');

  const onSizeChanged = (size: Size) => {
    const currentSizes = new Set(getValues('sizes'));
    currentSizes.has(size) ? currentSizes.delete(size) : currentSizes.add(size);
    setValue('sizes', Array.from(currentSizes));
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const formData = new FormData();
    const { images, ...productToSave } = data;

    if (product.id) formData.append('id', product.id);
    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('gender', productToSave.gender);

    if (images?.length) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const { ok, product: productSaved } = await createUpdateProduct(formData);

    if (!ok || !productSaved) {
      alert('Error al guardar el producto');
      return;
    }

    router.replace(`/admin/product/${productSaved.slug}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('title', { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('slug', { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description', { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register('price', { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register('inStock', { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('tags', { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register('gender', { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register('categoryId', { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={clsx({
            'btn-primary w-full': isValid,
            'btn-disabled w-full': !isValid,
          })}
          disabled={!isValid}
        >
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx(
                  'p-2 cursor-pointer text-center border rounded-md mr-2 mb-2 w-14 transition-all',
                  {
                    'bg-blue-500 text-white': getValues('sizes').includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              {...register('images')}
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.productImages?.map(({ id, url }) => (
              <div key={id}>
                <ProductImage
                  src={url}
                  alt={product.title ?? ''}
                  width={300}
                  height={300}
                  className="rounded-t-md"
                />
                <button
                  onClick={() => deleteProductImage(id, url)}
                  className="btn-danger w-full rounded-b-xl"
                  type="button"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
