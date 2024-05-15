import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express } from 'express';
import config from '../config/config';
import authController from './auth/auth.controller';
import userController from './entities/user/user.controller';
import { corsOptions } from './utils/corsOptions';

dotenv.config();
const app: Express = express();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());

// Centralized API router
const apiRouter = express.Router();
apiRouter.use('/auth', authController);
apiRouter.use('/users', userController);

// Apply /api/v1 prefix to the centralized router
app.use('/api/v1', apiRouter);

// Start the server
app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT}...`);
});
