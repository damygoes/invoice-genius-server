import { v4 as uuidv4 } from 'uuid';
import { SavedClient, SavedClientPayload } from '../types/SavedClient';

export const transformSavedClientFormToDbSchema = (
  savedClientForm: SavedClientPayload,
  userId: string
): SavedClient => {
  const newId = uuidv4();
  const setCustomId = (id: string) => {
    return `invoice-genius-saved-client-${id}`;
  };
  return {
    id: setCustomId(newId),
    firstName: savedClientForm.firstName ?? 'Anonymous',
    lastName: savedClientForm.lastName ?? 'Client',
    email: savedClientForm.email ?? undefined,
    address: {
      number: savedClientForm.address.number ?? undefined,
      street: savedClientForm.address.street ?? undefined,
      city: savedClientForm.address.city ?? undefined,
      state: savedClientForm.address.state ?? undefined,
      zip: savedClientForm.address.zip ?? undefined,
      country: savedClientForm.address.country ?? undefined,
    },
    phone: savedClientForm.phone ?? undefined,
    mobile: savedClientForm.mobile ?? undefined,
    belongsTo: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
