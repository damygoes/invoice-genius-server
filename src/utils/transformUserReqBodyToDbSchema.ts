import { v4 as uuidv4 } from 'uuid';
import { EmailOnlyUser, KindeUserDTO, UserDTO } from '../types/User';

const isKindeUserDTO = (reqBody: any): reqBody is KindeUserDTO => {
  return (
    reqBody &&
    (reqBody.id !== undefined ||
      reqBody.family_name !== undefined ||
      reqBody.given_name !== undefined ||
      reqBody.picture !== undefined)
  );
};
export const transformUserReqBodyToDbSchema = (
  reqBody: KindeUserDTO | EmailOnlyUser
): UserDTO => {
  const newId = uuidv4();
  const setCustomId = (id: string) => {
    return `invoice-genius-user-${id}`;
  };

  if (isKindeUserDTO(reqBody)) {
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
      userType: 'private',
      selectedServices: [],
      onboarded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else {
    return {
      id: setCustomId(newId),
      firstName: 'Anonymous',
      lastName: 'User',
      email: reqBody.email,
      profilePicture: undefined,
      username: undefined,
      phone: undefined,
      mobile: undefined,
      address: undefined,
      userType: 'private',
      selectedServices: [],
      onboarded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
};
