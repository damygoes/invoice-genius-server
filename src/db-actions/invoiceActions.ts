import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseProjectUrl, supabaseServiceRoleKey);

const uploadInvoiceToSupabaseBucket = async (
  pdfBuffer: Buffer,
  filePath: string
): Promise<{ path: string } | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('invoicePDFs')
      .upload(filePath, pdfBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error uploading file: ', error);
    return null;
  }
};

const fetchInvoiceFromSupabaseBucket = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('invoicePDFs')
      .download(filePath);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching file: ', error);
    return null;
  }
};

const deleteFileFromSupabaseBucket = async (filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from('invoicePDFs')
      .remove([filePath]);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file: ', error);
  }
};

const getUserInvoices = async (userId: string) => {
  try {
    const userInvoices = await prisma.userInvoices.findMany({
      where: {
        userId,
      },
    });
    return userInvoices;
  } catch (error) {
    console.error('Error getting user invoices: ', error);
    return null;
  }
};

const getInvoiceDetails = async (invoiceId: string) => {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: {
        id: invoiceId,
      },
    });
    return invoice;
  } catch (error) {
    console.error('Error getting invoice details: ', error);
    return null;
  }
};

export {
  deleteFileFromSupabaseBucket,
  fetchInvoiceFromSupabaseBucket,
  getInvoiceDetails,
  getUserInvoices,
  uploadInvoiceToSupabaseBucket,
};
