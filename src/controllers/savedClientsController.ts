import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import {
  getClientThatBelongsToUserByEmail,
  getClientThatBelongsToUserById,
  getUserSavedClients,
  updateUsersSavedClient,
} from '../db-actions/savedClientActions';
import { getUserWithEmail } from '../db-actions/userActions';
import { CustomRequest } from '../types/CustomRequest';
import { transformSavedClientFormToDbSchema } from '../utils/transformSavedClient';

const prisma = new PrismaClient();

const getUsersSavedClients = async (req: CustomRequest, res: Response) => {
  const user = req.user!;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (existingUser.email !== user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const clients = await getUserSavedClients(existingUser.id);
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error getting user saved clients: ', error);
    res.status(500).json({ message: 'Error getting user saved clients' });
  }
};

const getUsersSavedClientDetails = async (
  req: CustomRequest,
  res: Response
) => {
  const user = req.user!;
  const clientID = req.params.id;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (existingUser.email !== user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!clientID) {
    return res.status(400).json({ message: 'Client ID is required' });
  }
  const exisitingSavedClient = await getClientThatBelongsToUserById(
    existingUser.id,
    clientID
  );

  if (!exisitingSavedClient) {
    return res.status(404).json({ message: 'Client not found' });
  }

  if (exisitingSavedClient.belongsTo !== existingUser.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    res.status(200).json(exisitingSavedClient);
  } catch (error) {
    console.error('Error getting user saved client details: ', error);
    res
      .status(500)
      .json({ message: 'Error getting user saved client details' });
  }
};

const createSavedClient = async (req: CustomRequest, res: Response) => {
  const user = req.user!;
  const payload = req.body;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const transformedPayload = await transformSavedClientFormToDbSchema(
      payload,
      existingUser.id
    );

    const result = await prisma.$transaction(async (tx) => {
      const newClient = await tx.savedClient.create({
        data: transformedPayload,
      });

      await tx.userSavedClient.create({
        data: {
          userId: existingUser.id,
          clientId: newClient.id,
        },
      });

      return newClient;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error creating saved client' });
  } finally {
    await prisma.$disconnect();
  }
};

const updateSavedClient = async (req: CustomRequest, res: Response) => {
  const user = req.user!;
  const payload = req.body;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (existingUser.email !== user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const existingSavedClient = await getClientThatBelongsToUserByEmail(
    existingUser.id,
    payload.email
  );

  if (!existingSavedClient) {
    return res.status(404).json({ message: 'Client not found' });
  }

  if (existingSavedClient.email !== payload.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (existingUser.id !== existingSavedClient.belongsTo) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const client = await updateUsersSavedClient(
      existingSavedClient.id,
      payload
    );
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error updating saved client' });
  }
};

const deleteSavedClient = async (req: CustomRequest, res: Response) => {
  const user = req.user!;
  const savedClientId = req.params.id;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!savedClientId) {
    return res.status(400).json({ message: 'Client ID is required' });
  }

  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const existingSavedClient = await getClientThatBelongsToUserById(
    existingUser.id,
    savedClientId
  );

  if (!existingSavedClient) {
    return res.status(404).json({ message: 'Client not found' });
  }

  if (existingUser.id !== existingSavedClient.belongsTo) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Delete association in UserSavedClient table
      await tx.userSavedClient.deleteMany({
        where: {
          userId: existingUser.id,
          clientId: savedClientId,
        },
      });

      // Delete the saved client
      const deletedSavedClient = await tx.savedClient.delete({
        where: {
          id: savedClientId,
        },
      });

      return deletedSavedClient;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting saved client' });
  } finally {
    await prisma.$disconnect();
  }
};

export {
  createSavedClient,
  deleteSavedClient,
  getUsersSavedClientDetails,
  getUsersSavedClients,
  updateSavedClient,
};
