import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import {
  fetchInvoiceFromSupabaseBucket,
  uploadInvoiceToSupabaseBucket,
} from '../db-actions/invoiceActions';
import { getUserWithEmail } from '../db-actions/userActions';
import { sendInvoiceEmail } from '../services/sendInvoiceEmailService';
import { CustomRequest } from '../types/CustomRequest';
import { blobToBase64 } from '../utils/blobToBase64';

const prisma = new PrismaClient();

const getInvoices = async (req: CustomRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existingUser = await getUserWithEmail(user.email);

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (existingUser.email !== user.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Get user invoices
      const invoices = await prisma.userInvoices.findMany({
        where: { userId: existingUser.id },
        include: { invoice: true },
      });

      if (!invoices || invoices.length === 0) {
        throw new Error('Invoices not found');
      }

      // Fetch invoice details including PDF base64 URL
      const invoiceDetails = await Promise.all(
        invoices.map(async ({ invoice }) => {
          const invoiceData = await prisma.invoices.findUnique({
            where: { id: invoice.id },
            include: { images: true },
          });

          if (!invoiceData) {
            throw new Error('Invoice details not found');
          }

          // Fetch the PDF from Supabase
          const pdfBlob = await fetchInvoiceFromSupabaseBucket(
            invoiceData.images[0].image
          );
          if (!pdfBlob) {
            throw new Error('Error fetching PDF');
          }

          // Convert the Blob to a base64 string
          const pdfBase64 = await blobToBase64(pdfBlob);

          return {
            ...invoiceData,
            pdfBase64,
          };
        })
      );

      return invoiceDetails;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
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
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (existingUser.email !== user.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.body) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const invoiceData = JSON.parse(req.body.invoiceData);
  const pdfBuffer = req.file.buffer;

  const {
    client,
    items,
    invoiceSubTotal,
    invoiceVAT,
    invoiceTotal,
    dueDate,
    invoiceNumber,
  } = invoiceData;

  const existingClient = await prisma.savedClient.findUnique({
    where: { id: client },
  });

  if (!existingClient) {
    return res.status(404).json({ error: 'Client not found' });
  }

  if (existingClient.belongsTo !== existingUser.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Fetch business profile
      const businessProfile = await prisma.businessUserProfile.findUnique({
        where: { userId: existingUser.id },
      });
      if (!businessProfile) {
        throw new Error('Business profile not found');
      }
      // Define filePath for the PDF
      const filePath = `invoices/${existingUser.id}/${Date.now()}.pdf`;

      // Upload PDF to Supabase bucket
      const bucketUrl = await uploadInvoiceToSupabaseBucket(
        pdfBuffer,
        filePath
      );
      if (!bucketUrl) {
        throw new Error('Error uploading PDF');
      }
      // Save PDF URL to the database
      const invoice = await prisma.invoices.create({
        data: {
          clientId: client,
          invoiceDate: new Date(),
          invoiceNumber: invoiceNumber,
          dueDate: dueDate,
          amount: invoiceTotal,
          vat: invoiceVAT,
          subTotal: invoiceSubTotal,
          status: 'pending',
          invoiceItems: items,
          images: {
            create: {
              image: bucketUrl.path,
            },
          },
        },
      });
      // Save userId and invoiceId to UserInvoices
      await prisma.userInvoices.create({
        data: {
          userId: existingUser.id,
          invoiceId: invoice.id,
        },
      });
      return { invoice, filePath, existingClient };
    });

    // Fetch the PDF from Supabase bucket
    const pdfBlob = await fetchInvoiceFromSupabaseBucket(result.filePath);
    if (!pdfBlob) {
      throw new Error('Error fetching PDF');
    }

    // Convert the Blob to a base64 string
    const pdfBase64 = await blobToBase64(pdfBlob);

    // Send email outside the transaction
    await sendInvoiceEmail(result.existingClient.email, pdfBuffer);

    res.status(200).json({ invoice: result.invoice, pdfBase64 });
  } catch (error) {
    console.error(error);
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
