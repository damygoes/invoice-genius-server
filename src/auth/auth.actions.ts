import { PrismaClient, UserType } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { UserDto } from "../types/User";

const prisma = new PrismaClient();

const createNewUserInDatabase = async (user: UserDto) => {
  try {
    const newId = uuidv4();
    const newUser = await prisma.user.create({
      data: {
        id: newId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        phone: user.phone,
        mobile: user.mobile,
        profilePicture: user.profilePicture,
        address: user.address,
        type: UserType.private,
        onboarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user: ", error);
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
    console.error("Error getting user with email: ", error);
  }
};

export { createNewUserInDatabase, getUserWithEmail };
