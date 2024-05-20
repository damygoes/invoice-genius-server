import { z } from 'zod';
import { addressSchema } from './Address';

export const onboardingBusinessSchema = z.object({
  businessName: z.string(),
  businessAddress: addressSchema,
  businessEmail: z.string().email(),
  industry: z.string(),
});
