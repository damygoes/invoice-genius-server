import { Request, Response } from 'express';
import { kindeClient, sessionManager } from '../services/kinde';

const login = async (req: Request, res: Response) => {
  try {
    const loginUrl = await kindeClient.login(sessionManager);
    return res.redirect(loginUrl.toString());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const registerUrl = await kindeClient.register(sessionManager);
    return res.redirect(registerUrl.toString());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { login, register };
