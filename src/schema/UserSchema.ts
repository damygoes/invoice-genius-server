import { z } from 'zod';

export const UserSchemaValidator = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  profilePicture: z.string().optional(),
  address: z.string().optional(),
  userType: z.enum(['private', 'business']),
  selectedServices: z.array(
    z.enum(['receiptManagement', 'subscriptionManagement', 'invoicing'])
  ),
  onboarded: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
