import express from 'express';
import {
  getUser,
  getUserProfile,
  getUsers,
  onboardUser,
  updateUserProfile,
} from './user.service';

const userController = express.Router();

userController.get('/', getUsers);
userController.post('/onboard-user', onboardUser);
userController.post('/:userIdentifier', getUser);
userController.get('/:id', getUserProfile);
userController.patch('/profile/:id', updateUserProfile);

export default userController;
