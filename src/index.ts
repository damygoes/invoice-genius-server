import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express } from 'express';
import config from '../config/config';

import authRouter from './routes/authRoutes';
import avatarRouter from './routes/avatarUploadRoutes';
import subscriptionsServiceRouter from './routes/subscriptionsServiceRoutes';
import userRouter from './routes/userRoutes';
import { redisClient } from './services/redis';
import { corsOptions } from './utils/corsOptions';

dotenv.config();
const app: Express = express();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());
app.use(express.json());

// Centralized API router
const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/subscriptions-management', subscriptionsServiceRouter);
apiRouter.use('/avatar', avatarRouter);

// Apply /api/v1 prefix to the centralized router
app.use('/api/v1', apiRouter);

// connect to redis
redisClient.on('connect', () => {
  console.log('Connected to Redis...');
});

redisClient.on('error', (err) => {
  console.error('Error connecting to redis: ', err);
});

// Start the server
app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT}...`);
});
