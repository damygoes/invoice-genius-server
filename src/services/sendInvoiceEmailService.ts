import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

export const sendInvoiceEmail = async (to: string, pdfBuffer: Buffer) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'theinvoicegenius@gmail.com',
    to: to,
    subject: 'Your Recent Invoice from Invoice Genius',
    text: `Dear Customer,

Thank you for your business. Attached to this email, you will find the invoice for your recent transaction.

If you have any questions or need further assistance, please do not hesitate to contact us.

Best regards,
The Invoice Genius Team`,
    attachments: [
      {
        filename: 'invoice.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
