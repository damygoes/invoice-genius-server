import express from 'express';
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getUserSubscriptions,
  updateSubscription,
} from '../controllers/subscriptionsServiceController';

const subscriptionsServiceRouter = express.Router();

subscriptionsServiceRouter.get('/user/:id', getUserSubscriptions);
subscriptionsServiceRouter.post('/', createSubscription);
subscriptionsServiceRouter.get('/:id', getSubscription);
subscriptionsServiceRouter.patch('/:id', updateSubscription);
subscriptionsServiceRouter.delete('/:id', deleteSubscription);

export default subscriptionsServiceRouter;
