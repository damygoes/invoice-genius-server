export type OnboardingBusinessProfileDTO = {
  businessName: string;
  businessAddress: {
    number: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  businessEmail: string;
  industry: string;
};
