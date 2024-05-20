import { z } from 'zod';

export const addressSchema = z.object({
  number: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});
