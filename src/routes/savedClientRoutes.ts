import express from 'express';
import {
  createSavedClient,
  deleteSavedClient,
  getUsersSavedClientDetails,
  getUsersSavedClients,
  updateSavedClient,
} from '../controllers/savedClientsController';
import { authenticate } from '../middleware/authMiddleware';

const savedClientsRouter = express.Router();

savedClientsRouter.get('/', authenticate, getUsersSavedClients);
savedClientsRouter.post('/', authenticate, createSavedClient);
savedClientsRouter.patch('/:id', authenticate, updateSavedClient);
savedClientsRouter.delete('/:id', authenticate, deleteSavedClient);
savedClientsRouter.get('/:id', authenticate, getUsersSavedClientDetails);

export default savedClientsRouter;
