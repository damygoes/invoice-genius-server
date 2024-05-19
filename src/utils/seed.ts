import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  const usersArray = [
    {
      id: 'cjhd763v80000c1mp',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      mobile: '0987654321',
      profilePicture: 'https://example.com/johndoe.jpg',
      address: '123 Main Street, City, Country',
      type: UserType.business,
      onboarded: true,
      createdAt: new Date('2024-05-15T10:00:00Z'),
      updatedAt: new Date('2024-05-15T10:00:00Z'),
    },
    {
      id: 'cjhd763v80000c1mq',
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'alicesmith',
      email: 'alice@example.com',
      password: 'password456',
      phone: '9876543210',
      mobile: '0123456789',
      profilePicture: 'https://example.com/alicesmith.jpg',
      address: '456 Elm Street, City, Country',
      type: UserType.private,
      onboarded: true,
      createdAt: new Date('2024-05-15T11:00:00Z'),
      updatedAt: new Date('2024-05-15T11:00:00Z'),
    },
    {
      id: 'cjhd763v80000c1mr',
      firstName: 'Bob',
      lastName: 'Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
      password: 'password789',
      phone: '5555555555',
      mobile: '6666666666',
      profilePicture: 'https://example.com/bobjohnson.jpg',
      address: '789 Oak Street, City, Country',
      type: UserType.private,
      onboarded: false,
      createdAt: new Date('2024-05-15T12:00:00Z'),
      updatedAt: new Date('2024-05-15T12:00:00Z'),
    },
    {
      id: 'cjhd763v80000c1ms',
      firstName: 'Eva',
      lastName: 'Green',
      username: 'evagreen',
      email: 'eva@example.com',
      password: 'password321',
      phone: '1112223333',
      mobile: '4445556666',
      profilePicture: 'https://example.com/evagreen.jpg',
      address: '101 Pine Street, City, Country',
      type: UserType.private,
      onboarded: true,
      createdAt: new Date('2024-05-16T09:00:00Z'),
      updatedAt: new Date('2024-05-16T09:00:00Z'),
    },
    {
      id: 'cjhd763v80000c1mt',
      firstName: 'Michael',
      lastName: 'Brown',
      username: 'michaelbrown',
      email: 'michael@example.com',
      password: 'password987',
      phone: '7778889999',
      mobile: '0001112222',
      profilePicture: 'https://example.com/michaelbrown.jpg',
      address: '202 Oak Lane, City, Country',
      type: UserType.business,
      onboarded: false,
      createdAt: new Date('2024-05-16T10:00:00Z'),
      updatedAt: new Date('2024-05-16T10:00:00Z'),
    },
  ];

  for (const user of usersArray) {
    await prisma.user.create({
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
