import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import {
  createNewUserInDatabase,
  getUserWithEmail,
} from '../db-actions/userActions';
import { storeOTP, verifyOTP } from '../services/OTPService';
import { sendOTPEmail } from '../services/emailService';
import {
  deleteRefreshToken,
  generateAccessToken,
  generateAndStoreRefreshToken,
  verifyRefreshToken,
} from '../services/tokenService';
import { CustomRequest } from '../types/CustomRequest';
import { generateOTP } from '../utils/generateOTP';
dotenv.config();

const requestOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');

  let user = await getUserWithEmail(email);

  if (!user || user === undefined || user === null) {
    user = await createNewUserInDatabase({ email });
  }

  const otp = generateOTP();
  await sendOTPEmail(email, otp);
  await storeOTP(email, otp);

  res.status(200).send('OTP sent');
};

const verifyOTPCode = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send('Email and OTP are required');

  const isOTPValid = await verifyOTP(email, otp);
  if (!isOTPValid) return res.status(401).send('Invalid OTP');

  const accessToken = generateAccessToken(email);
  const refreshToken = await generateAndStoreRefreshToken(email);
  const user = await getUserWithEmail(email);

  res.status(200).json({
    message: 'OTP verified',
    accessToken,
    refreshToken,
    user,
  });
};

const refreshToken = async (req: CustomRequest, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).send('Refresh token is required');

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return res.status(401).send('Invalid refresh token');

  const accessToken = generateAccessToken(payload.email);
  res.status(200).json({
    accessToken,
  });
};

const logout = async (req: CustomRequest, res: Response) => {
  const { refreshToken } = req.body;

  const headerToken = req.headers['authorization'];
  const token = headerToken?.split(' ')[1];

  if (!refreshToken) return res.status(400).send('Refresh token is required');
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return res.status(401).send('Invalid refresh token');

  const deletedToken = await deleteRefreshToken(refreshToken, payload.email);
  if (!deletedToken) return res.status(500).send('Internal server error');

  res.status(204).send('Logged out successfully');
};

export { logout, refreshToken, requestOTP, verifyOTPCode };
