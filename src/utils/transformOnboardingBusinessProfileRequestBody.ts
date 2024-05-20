import { v4 as uuidv4 } from 'uuid';
import { OnboardingBusinessProfileDTO } from '../types/OnboardingBusinessProfileDTO';

export const transformOnboardingBusinessProfileRequestBody = (
  reqBodyBusinessData: OnboardingBusinessProfileDTO,
  exisitingUserID: string
) => {
  const newId = uuidv4();
  const setCustomId = (id: string) => {
    return `user-business-profile-${id}`;
  };
  return {
    id: setCustomId(newId),
    userId: exisitingUserID,
    businessName: reqBodyBusinessData.businessName,
    businessLogo: undefined,
    businessAddress: {
      number: reqBodyBusinessData.businessAddress.number,
      street: reqBodyBusinessData.businessAddress.street,
      city: reqBodyBusinessData.businessAddress.city,
      state: reqBodyBusinessData.businessAddress.state,
      zip: reqBodyBusinessData.businessAddress.zip,
      country: reqBodyBusinessData.businessAddress.country,
    },
    businessWebsite: undefined,
    businessInfo: undefined,
    businessEmail: reqBodyBusinessData.businessEmail,
    businessPhone: undefined,
    businessMobile: undefined,
    industry: reqBodyBusinessData.industry,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
