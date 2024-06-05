import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseProjectUrl, supabaseServiceRoleKey);

export const uploadInvoiceToSupabaseBucket = async (
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
