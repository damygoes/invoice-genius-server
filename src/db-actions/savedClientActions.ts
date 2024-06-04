import { PrismaClient } from '@prisma/client';
import { SavedClient } from '../types/SavedClient';

const prisma = new PrismaClient();

const createNewSavedClient = async (client: SavedClient) => {
  try {
    const newClient = await prisma.savedClient.create({
      data: client,
    });
    return newClient;
  } catch (error) {
    console.error('Error creating saved client: ', error);
  }
};

const getUserSavedClients = async (userId: string) => {
  try {
    const clients = await prisma.savedClient.findMany({
      where: {
        belongsTo: userId,
      },
    });

    return clients;
  } catch (error) {
    console.error('Error getting user saved clients: ', error);
  }
};

const getClientThatBelongsToUserByEmail = async (
  userId: string,
  clientEmail: string
) => {
  try {
    const client = await prisma.savedClient.findFirst({
      where: {
        belongsTo: userId,
        email: clientEmail,
      },
    });

    return client;
  } catch (error) {
    console.error('Error getting client that belongs to user: ', error);
  }
};

const getClientThatBelongsToUserById = async (
  userId: string,
  clientId: string
) => {
  try {
    const client = await prisma.savedClient.findFirst({
      where: {
        belongsTo: userId,
        id: clientId,
      },
    });

    return client;
  } catch (error) {
    console.error('Error getting client that belongs to user: ', error);
  }
};

const getUserSavedClientDetails = async (userId: string, clientId: string) => {
  try {
    const client = await prisma.savedClient.findUnique({
      where: {
        id: clientId,
        belongsTo: userId,
      },
    });

    return client;
  } catch (error) {
    console.error('Error getting user saved client details: ', error);
  }
};

const updateUsersSavedClient = async (
  clientId: string,
  client: SavedClient
) => {
  try {
    const updatedClient = await prisma.savedClient.update({
      where: {
        id: clientId,
      },
      data: client,
    });

    return updatedClient;
  } catch (error) {
    console.error('Error updating saved client: ', error);
  }
};

const deleteSavedClientInDb = async (clientId: string) => {
  try {
    await prisma.savedClient.delete({
      where: {
        id: clientId,
      },
    });
  } catch (error) {
    console.error('Error deleting saved client: ', error);
  }
};

export {
  createNewSavedClient,
  deleteSavedClientInDb,
  getClientThatBelongsToUserByEmail,
  getClientThatBelongsToUserById,
  getUserSavedClientDetails,
  getUserSavedClients,
  updateUsersSavedClient,
};
