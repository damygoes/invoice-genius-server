import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../services/tokenService';
import { UserDTO } from '../types/User';

interface CustomRequest extends Request {
  user?: UserDTO;
}

export const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access token missing or invalid');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).send('Access token invalid or expired');
  }

  req.user = payload as UserDTO;
  next();
};
