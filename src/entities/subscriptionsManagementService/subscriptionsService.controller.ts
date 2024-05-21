import express from 'express';
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getUserSubscriptions,
  updateSubscription,
} from './subscriptionsService.service';

const subscriptionsManagementServiceController = express.Router();

subscriptionsManagementServiceController.get('/user/:id', getUserSubscriptions);
subscriptionsManagementServiceController.post('/', createSubscription);
subscriptionsManagementServiceController.get('/:id', getSubscription);
subscriptionsManagementServiceController.patch('/:id', updateSubscription);
subscriptionsManagementServiceController.delete('/:id', deleteSubscription);

export default subscriptionsManagementServiceController;
