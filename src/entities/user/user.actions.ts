import { PrismaClient } from '@prisma/client';
import { OnboardingBusinessProfileDTO } from '../../types/OnboardingBusinessProfileDTO';
import { KindeUserDTO } from '../../types/User';
import { transformOnboardingBusinessProfileRequestBody } from '../../utils/transformOnboardingBusinessProfileRequestBody';
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

const createUserBusinessProfile = async (
  userID: string,
  profile: OnboardingBusinessProfileDTO
) => {
  try {
    const userInDb = await getUserWithId(userID);
    if (!userInDb) {
      return;
    }
    const transformedUserProfile =
      transformOnboardingBusinessProfileRequestBody(profile, userID);
    const newUserBusinessProfile = await prisma.businessUserProfile.create({
      data: {
        ...transformedUserProfile,
      },
    });
    return newUserBusinessProfile;
  } catch (error) {
    console.error('Error creating user business profile: ', error);
  }
};

export {
  createNewUserInDatabase,
  createUserBusinessProfile,
  getUserWithEmail,
  getUserWithId,
};
