import {
  OnboardingRequest,
  onboardingRequestSchema,
} from '../schema/OnboardingRequest';

export function validateOnboardingRequestBody(reqBody: OnboardingRequest) {
  return onboardingRequestSchema.safeParse(reqBody);
}
