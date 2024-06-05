import PDFDocument from 'pdfkit';
import { formatDate } from '../utils/formatDate';

export const generateInvoicePDF = async ({
  businessProfile,
  clientDetails,
  items,
  invoiceSubTotal,
  invoiceVAT,
  invoiceTotal,
  dueDate,
}: {
  businessProfile: any;
  clientDetails: any;
  items: any;
  invoiceSubTotal: number;
  invoiceVAT: number;
  invoiceTotal: number;
  dueDate: string;
}): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    const clientName = `${clientDetails.firstName} ${clientDetails.lastName}`;
    const clientAddress = `${clientDetails.address.street} ${clientDetails.address.number}, ${clientDetails.address.zip} ${clientDetails.address.city}, ${clientDetails.address.state} ${clientDetails.address.country}`;
    const businessAddress = `${businessProfile.businessAddress.street} ${businessProfile.businessAddress.number} ${businessProfile.businessAddress.zip} ${businessProfile.businessAddress.city} ${businessProfile.businessAddress.state} ${businessProfile.businessAddress.country}`;

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add invoice content to PDF
    doc.text(`Business Name: ${businessProfile.businessName}`);
    doc.text(`Address: ${businessAddress}`);
    doc.text(`Website: ${businessProfile.businessWebsite}`);
    doc.text(`Email: ${businessProfile.businessEmail}`);
    doc.text(`Mobile: ${businessProfile.businessMobile}`);
    doc.moveDown();

    doc.text(`Invoice for ${clientName}`);
    doc.text(`Address: ${clientAddress}`);
    doc.moveDown();

    doc.text(`Issue Date: ${new Date().toDateString()}`);
    doc.text(`Due Date: ${formatDate(dueDate)}`);
    doc.moveDown();

    items.forEach((item: any) => {
      doc.text(`Service: ${item.serviceName}`);
      doc.text(`Description: ${item.serviceDescription}`);
      doc.text(`Rate: ${item.rate}`);
      doc.text(`Hours: ${item.hours}`);
      doc.text(`Amount: ${item.amount}`);
      doc.moveDown();
    });

    doc.text(`Subtotal: ${invoiceSubTotal}`);
    doc.text(`VAT: ${invoiceVAT}`);
    doc.text(`Total: ${invoiceTotal}`);

    doc.end();
  });
};
