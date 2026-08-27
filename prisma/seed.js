import { prisma } from '../src/config/prisma.js';

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.user.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@system.com',
      age: 30,
      posts: {
        create: [{ title: 'Welcome to system', published: true }]
      }
    }
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());


// ADD CONFIG TO package.json
// "prisma": {
//   "seed": "node prisma/seed.js"
// }

// RUN COMMAND IN TERMINAL
// npx prisma db seed