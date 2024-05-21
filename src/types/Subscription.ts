import { RecurringInterval } from '@prisma/client';

export type SubscriptionPayload = {
  subscriptionName: string;
  subscriptionCategory: string;
  recurring: boolean;
  recurringInterval?: RecurringInterval;
  subscribedOn: Date;
  expiresOn: Date;
  setReminder: boolean;
  reminderPeriod?: Date;
};
export type SubscriptionDTO = {
  id: string;
  userId: string;
  subscriptionName: string;
  subscriptionCategory: string;
  recurring: boolean;
  recurringInterval?: RecurringInterval;
  subscribedOn: Date;
  expiresOn: Date;
  setReminder: boolean;
  reminderPeriod?: Date;
  createdAt: Date;
  updatedAt: Date;
};
