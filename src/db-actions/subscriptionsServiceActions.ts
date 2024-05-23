import { PrismaClient } from '@prisma/client';
import { SubscriptionDTO } from '../types/Subscription';

const prisma = new PrismaClient();

const createNewSubscription = async (subscription: SubscriptionDTO) => {
  try {
    const newSubscription = await prisma.subscriptionsService.create({
      data: subscription,
    });
    return newSubscription;
  } catch (error) {
    console.error('Error creating subscription: ', error);
  }
};

export { createNewSubscription };
