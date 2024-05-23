import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { deleteToken, storeRefreshToken } from '../db-actions/tokenActions';
dotenv.config();

interface TokenPayload {
  email: string;
}

export const generateAccessToken = (email: string): string => {
  const payload: TokenPayload = { email };
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

export const generateAndStoreRefreshToken = async (
  email: string
): Promise<string> => {
  const payload: TokenPayload = { email };
  const refreshTokenExpiryDate = process.env.JWT_REFRESH_EXPIRATION!;

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: refreshTokenExpiryDate,
  });

  await storeRefreshToken(
    refreshToken,
    email,
    new Date(Date.now() + parseInt(refreshTokenExpiryDate))
  );

  return refreshToken;
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const deleteRefreshToken = (token: string, userEmail: string) => {
  try {
    const deletedRefreshToken = deleteToken(token, userEmail);
    return deletedRefreshToken;
  } catch (error) {
    console.error('Error deleting refresh token: ', error);
    return null;
  }
};

/**
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvZ3doZWVsZXJzcHlrQGdtYWlsLmNvbSIsImlhdCI6MTcxNjQ2NTExOSwiZXhwIjoxNzE3MDY5OTE5fQ.J9iHtnGRDILz7UsN0XMsRfHNtu8Ki1cOT8AT2UKVvbk
 */
