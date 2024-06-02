import express from "express";
import {
  logout,
  refreshToken,
  requestOTP,
  verifyOTPCode,
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/request-otp", requestOTP);
authRouter.post("/verify-otp", verifyOTPCode);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
