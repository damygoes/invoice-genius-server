import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  const usersArray = [
    {
      id: 'cjhd763v80000c1mp',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '1234567890',
      mobile: '0987654321',
      profilePicture: 'https://example.com/johndoe.jpg',
      address: '123 Main Street, City, Country',
      type: 'business',
      onboarded: true,
      createdAt: '2024-05-15T10:00:00Z',
      updatedAt: '2024-05-15T10:00:00Z',
    },
    {
      id: 'cjhd763v80000c1mq',
      name: 'Alice Smith',
      username: 'alicesmith',
      email: 'alice@example.com',
      phone: '9876543210',
      mobile: '0123456789',
      profilePicture: 'https://example.com/alicesmith.jpg',
      address: '456 Elm Street, City, Country',
      type: 'private',
      onboarded: true,
      createdAt: '2024-05-15T11:00:00Z',
      updatedAt: '2024-05-15T11:00:00Z',
    },
    {
      id: 'cjhd763v80000c1mr',
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
      phone: '5555555555',
      mobile: '6666666666',
      profilePicture: 'https://example.com/bobjohnson.jpg',
      address: '789 Oak Street, City, Country',
      type: 'private',
      onboarded: false,
      createdAt: '2024-05-15T12:00:00Z',
      updatedAt: '2024-05-15T12:00:00Z',
    },
  ];
  for (const user of usersArray) {
    await prisma.User.create({
      data: user,
    });
  }
};

async function main() {
  try {
    await seed();

    console.log('Seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
