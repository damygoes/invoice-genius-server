import express from 'express';
import {
  getUser,
  getUsers,
  onboardUser,
  updateUserProfile,
} from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', authenticate, getUser);
userRouter.post('/onboard-user', onboardUser);
userRouter.patch('/profile/:id', updateUserProfile);

export default userRouter;

// userRouter.post("/:userIdentifier", getUser);
