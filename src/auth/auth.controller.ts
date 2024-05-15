import express from 'express';
import { login, register } from './auth.service';

const authController = express.Router();

authController.get('/login', login);
authController.get('/register', register);

export default authController;
