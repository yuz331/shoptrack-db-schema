import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Clean slate
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Categories
  const categoryNames = ['Electronics', 'Books', 'Home & Kitchen', 'Sports', 'Toys'];
  const categories = await Promise.all(
    categoryNames.map((name) => prisma.category.create({ data: { name } }))
  );

  // Users (10)
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
        },
      })
    )
  );

  // Products (25)
  const products = await Promise.all(
    Array.from({ length: 25 }).map(() => {
      const category = faker.helpers.arrayElement(categories);
      return prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
          stock: faker.number.int({ min: 0, max: 200 }),
          imageUrl: faker.image.urlPicsumPhotos(),
          categoryId: category.id,
        },
      });
    })
  );

  // Orders + OrderItems + Reviews
  for (const user of users) {
    // Each user makes 1–3 orders
    const orderCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < orderCount; i++) {
      // Pick 1–5 products per order
      const items = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 }));

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          status: faker.helpers.arrayElement(['pending', 'paid', 'shipped', 'delivered']),
          total: 0, // temp; we’ll update after items
        },
      });

      let runningTotal = 0;

      // Create order items
      for (const p of items) {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const priceAtPurchase = p.price;
        runningTotal += priceAtPurchase * quantity;

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: p.id,
            quantity,
            price: priceAtPurchase,
          },
        });

        // Random review on some items
        if (faker.datatype.boolean()) {
          await prisma.review.create({
            data: {
              userId: user.id,
              productId: p.id,
              rating: faker.number.int({ min: 1, max: 5 }),
              comment: faker.lorem.sentence(),
            },
          });
        }
      }

      // Update order total
      await prisma.order.update({
        where: { id: order.id },
        data: { total: parseFloat(runningTotal.toFixed(2)) },
      });
    }
  }

  console.log('✅ Seeded: categories, users, products, orders, orderItems, reviews');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
