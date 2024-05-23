import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { transformSubscriptionPayload } from '../utils/transformSubscriptionPayload';

const prisma = new PrismaClient();

const createSubscription = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (existingUser.id !== userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Check if user has subscriptionService selected in their profile
  if (!existingUser.selectedServices.includes('subscriptionManagement')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User has not selected subscriptionManagement service',
    });
  }
  const subscription = req.body;
  const transformedSubscription = await transformSubscriptionPayload(
    subscription,
    userId
  );
  try {
    const newSubscription = await prisma.subscriptionsService.create({
      data: transformedSubscription,
    });
    return res.status(201).json({
      message: 'Subscription created successfully',
      subscription: newSubscription,
    });
  } catch (error) {
    console.error('Error creating subscription: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubscription = async (req: Request, res: Response) => {
  // const { id } = req.params;
  // const subscription = await prisma.subscriptionsService.findUnique({
  //   where: {
  //     id,
  //   },
  // });
  // if (!subscription) {
  //   return res.status(404).json({ error: "Subscription not found" });
  // }
  // return res.status(200).json({ subscription });
};

const getUserSubscriptions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (existingUser.id !== id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const subscriptions = await prisma.subscriptionsService.findMany({
    where: {
      userId: id,
    },
  });
  return res.status(200).json({ subscriptions });
};

const updateSubscription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, ...rest } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (existingUser.id !== userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existingSubscription = await prisma.subscriptionsService.findUnique({
    where: {
      id,
    },
  });

  if (!existingSubscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  if (existingSubscription.userId !== userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const updatedSubscription = await prisma.subscriptionsService.update({
    where: {
      id,
    },
    data: {
      ...rest,
      createdAt: existingSubscription.createdAt,
      updatedAt: new Date(),
    },
  });
  return res.status(200).json({ updatedSubscription });
};

const deleteSubscription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
  });

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (existingUser.id !== userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existingSubscription = await prisma.subscriptionsService.findUnique({
    where: {
      id,
    },
  });

  if (!existingSubscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  if (existingSubscription.userId !== userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const deletedSubscription = await prisma.subscriptionsService.delete({
      where: {
        id,
      },
    });
    return res.status(204).json({ deletedSubscription });
  } catch (error) {
    console.error('Error deleting subscription: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getUserSubscriptions,
  updateSubscription,
};
