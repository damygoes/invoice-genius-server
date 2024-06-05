import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomRequest } from '../types/CustomRequest';

const prisma = new PrismaClient();

const getInvoices = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createInvoice = async (req: CustomRequest, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const sendInvoice = async (req: CustomRequest, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteInvoice = async (req: CustomRequest, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getInvoice = async (req: CustomRequest, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { createInvoice, deleteInvoice, getInvoice, getInvoices, sendInvoice };
