import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import {
  createNewUserInDatabase,
  getUserWithEmail,
  getUserWithId,
} from './user.actions';

const prisma = new PrismaClient();

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { userIdentifier } = req.params;
  const userIdentifierIsEmail = userIdentifier.includes('@');

  if (userIdentifierIsEmail) {
    const user = await getUserWithEmail(userIdentifier);
    if (user) {
      res.json(user);
    } else {
      try {
        const newUser = await createNewUserInDatabase({
          ...req.body,
        });
        if (newUser === null || newUser === undefined) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json({
          message: 'User created successfully',
          userId: newUser.id,
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    const user = await getUserWithId(userIdentifier);
    if (user) {
      res.json(user);
    } else {
      try {
        const newUser = await createNewUserInDatabase({
          ...req.body,
        });
        if (newUser === null || newUser === undefined) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json({
          message: 'User created successfully',
          userId: newUser.id,
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
};

const onboardUser = async (req: Request, res: Response) => {
  const { userType, services, user } = req.body;

  const existingUser = await getUserWithId(user.id);

  if (existingUser) {
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
        message: 'User onboarded successfully',
        user: updatedUser,
        status: 200,
      });
    } catch (error) {
      res.json({ message: 'Internal Server Error', status: 500 });
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

export { getUser, getUsers, onboardUser };
