import express from 'express';
import { login, logout, register } from './auth.service';

const authController = express.Router();

authController.post('/login', login);
authController.post('/register', register);
authController.post('/logout', logout);

export default authController;
