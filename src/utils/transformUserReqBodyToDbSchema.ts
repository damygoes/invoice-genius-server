import { UserType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { KindeUserDTO, UserDTO } from '../types/User';
export const transformUserReqBodyToDbSchema = (
  reqBody: KindeUserDTO
): UserDTO => {
  const newId = uuidv4();
  const setCustomId = (id: string) => {
    return `invoice-genius-user-${id}`;
  };
  return {
    id: reqBody.id ? setCustomId(reqBody.id) : setCustomId(newId),
    firstName: reqBody.family_name ?? 'Anonymous',
    lastName: reqBody.given_name ?? 'User',
    email: reqBody.email ?? '',
    profilePicture: reqBody.picture ?? undefined,
    username: undefined,
    phone: undefined,
    mobile: undefined,
    address: undefined,
    userType: UserType.private,
    selectedServices: [],
    onboarded: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
