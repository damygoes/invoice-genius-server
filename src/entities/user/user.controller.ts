import express from 'express';
import { createUser, getUserById, getUsers } from './user.service';

const userController = express.Router();

userController.get('/', getUsers);
userController.post('/', createUser);
userController.get('/:id', getUserById);

export default userController;
