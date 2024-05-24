import express from 'express';
import multer from 'multer';
import {
  getUserAvatar,
  uploadAvatarHandler,
} from '../controllers/avatarUploadController';
import { authenticate } from '../middleware/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });

const avatarRouter = express.Router();

avatarRouter.get('/:id', authenticate, getUserAvatar);

avatarRouter.post(
  '/',
  authenticate,
  upload.single('file'),
  uploadAvatarHandler
);

export default avatarRouter;
