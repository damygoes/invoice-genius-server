import { Services, UserType } from '@prisma/client';

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  username: string | undefined;
  email: string;
  phone: string | undefined;
  mobile: string | undefined;
  profilePicture: string | undefined;
  address: {
    number: string | undefined;
    street: string | undefined;
    city: string | undefined;
    state: string | undefined;
    zip: string | undefined;
    country: string | undefined;
  };
  userType: UserType;
  selectedServices: Services[];
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type KindeUserDTO = {
  given_name: string | null;
  id: string | null;
  family_name: string | null;
  email: string | null;
  picture: string | null;
};

export type EmailOnlyUser = {
  email: string;
};
