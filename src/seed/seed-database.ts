import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main(): Promise<void> {
  // Delete all data from the database

  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const { categories, products, users } = initialData;

  await prisma.country.createMany({
    data: countries,
  });

  // Users
  await prisma.user.createMany({
    data: users,
  });

  // Categories
  const categoriesData = categories.map((name) => ({ name }));
  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();
  const categoriesMapped = categoriesDB.reduce((map, { id, name }) => {
    map[name.toLowerCase()] = id;
    return map;
  }, {} as Record<string, string>);

  // Products
  products.forEach(async ({ type, images, ...product }) => {
    const productDB = await prisma.product.create({
      data: {
        ...product,
        categoryId: categoriesMapped[type],
      },
    });

    // Product images
    const imagesData = images.map((url) => ({
      url,
      productId: productDB.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log('Seed executed');
}

((): void => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();
