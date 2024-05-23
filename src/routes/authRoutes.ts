import express from 'express';
import {
  logout,
  refreshToken,
  requestOTP,
  verifyOTPCode,
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const authRouter = express.Router();

// authRouter.post("/login", login);
// authRouter.post("/register", register);
// authRouter.post("/logout", logout);

authRouter.post('/request-otp', requestOTP);
authRouter.post('/verify-otp', verifyOTPCode);
authRouter.post('/refresh-token', authenticate, refreshToken);
authRouter.post('/logout', authenticate, logout);

export default authRouter;