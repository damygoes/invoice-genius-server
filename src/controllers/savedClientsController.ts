import { Response } from "express";
import {
  createNewSavedClient,
  deleteSavedClientInDb,
  getClientThatBelongsToUserByEmail,
  getClientThatBelongsToUserById,
  getUserSavedClients,
  updateUsersSavedClient,
} from "../db-actions/savedClientActions";
import { getUserWithEmail } from "../db-actions/userActions";
import { CustomRequest } from "../types/CustomRequest";
import { transformSavedClientFormToDbSchema } from "../utils/transformSavedClient";

const getUsersSavedClients = async (req: CustomRequest, res: Response) => {
  const user = req.user!;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (existingUser.email !== user.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const clients = await getUserSavedClients(existingUser.id);
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error getting user saved clients: ", error);
    res.status(500).json({ message: "Error getting user saved clients" });
  }
};

const createSavedClient = async (req: CustomRequest, res: Response) => {
  const user = req.user!;
  const payload = req.body;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const transformedPayload = await transformSavedClientFormToDbSchema(
      payload,
      existingUser.id,
    );
    const newClient = await createNewSavedClient(transformedPayload);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Error creating saved client" });
  }
};

const updateSavedClient = async (req: CustomRequest, res: Response) => {
  const user = req.user!;
  const payload = req.body;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (existingUser.email !== user.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const existingSavedClient = await getClientThatBelongsToUserByEmail(
    existingUser.id,
    payload.email,
  );

  if (!existingSavedClient) {
    return res.status(404).json({ message: "Client not found" });
  }

  if (existingSavedClient.email !== payload.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (existingUser.id !== existingSavedClient.belongsTo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = await updateUsersSavedClient(
      existingSavedClient.id,
      payload,
    );
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error updating saved client" });
  }
};

const deleteSavedClient = async (req: CustomRequest, res: Response) => {
  console.log("req user: ", req.user);
  console.log("params: ", req.params);

  const user = req.user!;
  const savedClientId = req.params.id;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!savedClientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const existingSavedClient = await getClientThatBelongsToUserById(
    existingUser.id,
    savedClientId,
  );

  if (!existingSavedClient) {
    return res.status(404).json({ message: "Client not found" });
  }

  if (existingUser.id !== existingSavedClient.belongsTo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const deletedSavedClient = await deleteSavedClientInDb(savedClientId);
    res.status(200).json(deletedSavedClient);
  } catch (error) {
    res.status(500).json({ message: "Error deleting saved client" });
  }
};

export {
  createSavedClient,
  deleteSavedClient,
  getUsersSavedClients,
  updateSavedClient,
};
