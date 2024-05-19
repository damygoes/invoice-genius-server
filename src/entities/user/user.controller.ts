import express from 'express';
import { getUser, getUsers, onboardUser } from './user.service';

const userController = express.Router();

userController.get('/', getUsers);
userController.post('/onboard-user', onboardUser);
userController.post('/:userIdentifier', getUser);

export default userController;
