import express from 'express';
import multer from 'multer';
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  getInvoices,
  sendInvoice,
} from '../controllers/invoiceController';
import { authenticate } from '../middleware/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });

const invoiceRouter = express.Router();

invoiceRouter.get('/', authenticate, getInvoices);
invoiceRouter.post('/', authenticate, createInvoice);
invoiceRouter.post(
  '/send-invoice',
  authenticate,
  upload.single('pdf'),
  sendInvoice
);
invoiceRouter.delete('/:id', authenticate, deleteInvoice);
invoiceRouter.get('/:id', authenticate, getInvoice);

export default invoiceRouter;
