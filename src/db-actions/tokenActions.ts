import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const storeRefreshToken = async (
  refreshToken: string,
  userEmail: string,
  expiryDate: Date
) => {
  const storedToken = await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userEmail,
      expiresAt: expiryDate,
    },
  });

  return storedToken;
};

export const deleteToken = async (token: string, email: string) => {
  const deletedToken = await prisma.refreshToken.delete({
    where: {
      token,
      userEmail: email,
    },
  });
  return deletedToken;
};
