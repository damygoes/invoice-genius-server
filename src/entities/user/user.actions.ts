import { PrismaClient } from '@prisma/client';
import { KindeUserDTO } from '../../types/User';
import { transformUserReqBodyToDbSchema } from '../../utils/transformUserReqBodyToDbSchema';

const prisma = new PrismaClient();

const createNewUserInDatabase = async (user: KindeUserDTO) => {
  try {
    const transformedUser = transformUserReqBodyToDbSchema(user);
    const newUser = await prisma.user.create({
      data: transformedUser,
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user: ', error);
  }
};

const getUserWithEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user with email: ', error);
  }
};

const getUserWithId = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user with id: ', error);
  }
};

export { createNewUserInDatabase, getUserWithEmail, getUserWithId };
