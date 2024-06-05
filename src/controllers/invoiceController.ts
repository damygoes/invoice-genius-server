import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { uploadInvoiceToSupabaseBucket } from '../db-actions/invoiceActions';
import { generateInvoicePDF } from '../services/invoicePDFGenerationService';
import { sendInvoiceEmail } from '../services/sendInvoiceEmailService';
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

// const sendInvoice = async (req: CustomRequest, res: Response) => {
//   console.log("user: ", req.user);
//   console.log("payload: ", req.body);
//   const user = req.user;

//   if (!user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   const existingUser = await getUserWithEmail(user.email);

//   if (!existingUser) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   if (existingUser.email !== user.email) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   if (!req.body) {
//     return res.status(400).json({ error: "Bad Request" });
//   }

//   const existingClient = await getClientThatBelongsToUserById(
//     existingUser.id,
//     req.body.client,
//   );

//   if (!existingClient) {
//     return res.status(404).json({ error: "Client not found" });
//   }

//   if (existingClient.belongsTo !== existingUser.id) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   console.log("existingClient: ", existingClient);

//   try {
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

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

  const { client, items, invoiceSubTotal, invoiceVAT, invoiceTotal, dueDate } =
    req.body;

  if (!req.body) {
    return res.status(400).json({ error: 'Bad Request' });
  }

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
      // Generate PDF
      const pdfBuffer = await generateInvoicePDF({
        businessProfile,
        clientDetails: existingClient,
        items,
        invoiceSubTotal,
        invoiceVAT,
        invoiceTotal,
        dueDate,
      });
      // Define file path and name
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
      // Send email
      await sendInvoiceEmail(existingClient.email, pdfBuffer);
      // Save userId and invoiceId to UserInvoices
      await prisma.userInvoices.create({
        data: {
          userId: existingUser.id,
          invoiceId: invoice.id,
        },
      });
      return invoice;
    });
    res.status(200).json(result);
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
