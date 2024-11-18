import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderStatus.createMany({
    data: [
      { name: 'PENDING' },
      { name: 'CONFIRMED' },
      { name: 'CANCELLED' },
      { name: 'COMPLETED' },
    ],
  });

  await prisma.category.createMany({
    data: [
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Books' },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
