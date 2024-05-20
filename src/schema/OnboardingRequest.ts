import { z } from 'zod';
import { onboardingBusinessSchema } from './OnboardingBusiness';
import { UserSchemaValidator } from './UserSchema';

export const onboardingRequestSchema = z.object({
  userType: z.enum(['private', 'business']),
  services: z.array(
    z.enum(['receiptManagement', 'subscriptionManagement', 'invoicing'])
  ),
  user: UserSchemaValidator,
  business: onboardingBusinessSchema.optional(),
});

export type OnboardingRequest = z.infer<typeof onboardingRequestSchema>;
