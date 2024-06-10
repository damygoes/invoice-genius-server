/*
  Warnings:

  - Added the required column `invoiceNumber` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessUserProfile" ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bic" TEXT,
ADD COLUMN     "iban" TEXT,
ADD COLUMN     "payPalEmail" TEXT;

-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "invoiceNumber" TEXT NOT NULL;
