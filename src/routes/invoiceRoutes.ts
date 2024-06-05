import express from 'express';
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  getInvoices,
  sendInvoice,
} from '../controllers/invoiceController';
import { authenticate } from '../middleware/authMiddleware';

const invoiceRouter = express.Router();

invoiceRouter.get('/', authenticate, getInvoices);
invoiceRouter.post('/', authenticate, createInvoice);
invoiceRouter.post('/send-invoice', authenticate, sendInvoice);
invoiceRouter.delete('/:id', authenticate, deleteInvoice);
invoiceRouter.get('/:id', authenticate, getInvoice);

export default invoiceRouter;
