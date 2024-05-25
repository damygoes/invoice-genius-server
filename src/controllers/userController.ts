import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  createUserBusinessProfile,
  getUserWithId,
} from '../db-actions/userActions';
import { CustomRequest } from '../types/CustomRequest';

const prisma = new PrismaClient();

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const onboardUser = async (req: Request, res: Response) => {
  const { userType, services, user, business } = req.body;

  const existingUser = await getUserWithId(user.id);

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (existingUser && userType === 'private') {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          onboarded: true,
          userType: userType,
          selectedServices: services,
        },
      });
      res.json({
        message: 'User onboarding successful',
        user: updatedUser,
        status: 200,
      });
    } catch (error) {
      res.json({ message: 'Internal Server Error', status: 500 });
    }
  }
  if (existingUser && userType === 'business') {
    try {
      // Start the transaction
      await prisma.$transaction(async (prisma) => {
        if (existingUser && userType === 'business') {
          // Update user
          const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              onboarded: true,
              userType: userType,
              selectedServices: services,
            },
          });
          // Create business profile
          await createUserBusinessProfile(existingUser.id, business);
          // Commit the transaction
          await prisma.$queryRaw`COMMIT`;
          res.json({
            message: 'User onboarding successful',
            user: updatedUser,
            status: 200,
          });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      });
    } catch (error) {
      // Rollback the transaction on error
      await prisma.$queryRaw`ROLLBACK`;
      res.json({ message: 'Internal Server Error', status: 500 });
    } finally {
      // Disconnect Prisma Client
      await prisma.$disconnect();
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

const getUser = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const existingUser = await getUserWithId(id);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (existingUser.userType === 'private') {
    return res.json(existingUser);
  }

  if (existingUser.userType === 'business') {
    try {
      const userBusinessProfile = await prisma.businessUserProfile.findUnique({
        where: {
          userId: existingUser.id,
        },
      });
      if (userBusinessProfile) {
        return res.json(userBusinessProfile);
      } else {
        return res
          .status(404)
          .json({ error: 'User business profile not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const updateUserProfile = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const existingUser = await getUserWithId(id);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (existingUser.userType === 'private') {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          ...req.body,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (existingUser.userType === 'business') {
    try {
      const updatedBusinessProfile = await prisma.businessUserProfile.update({
        where: { userId: existingUser.id },
        data: {
          ...req.body,
        },
      });
      res.json(updatedBusinessProfile);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export { getUser, getUsers, onboardUser, updateUserProfile };
