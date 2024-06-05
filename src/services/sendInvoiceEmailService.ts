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
    subject: 'Your Invoice',
    text: 'Please find attached your invoice.',
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
