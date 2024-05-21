import { v4 as uuidv4 } from 'uuid';
import { SubscriptionDTO, SubscriptionPayload } from '../types/Subscription';
export const transformSubscriptionPayload = (
  reqBody: SubscriptionPayload,
  userId: string
): SubscriptionDTO => {
  const newId = uuidv4();
  const setCustomId = (id: string) => {
    return `subscription-service-${id}`;
  };
  return {
    id: setCustomId(newId),
    userId: userId,
    subscriptionName: reqBody.subscriptionName,
    subscriptionCategory: reqBody.subscriptionCategory,
    recurring: reqBody.recurring,
    recurringInterval: reqBody.recurringInterval,
    subscribedOn: reqBody.subscribedOn,
    expiresOn: reqBody.expiresOn,
    setReminder: reqBody.setReminder,
    reminderPeriod: reqBody.reminderPeriod,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
