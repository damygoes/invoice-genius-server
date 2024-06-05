/*
  Warnings:

  - You are about to drop the column `clientId` on the `InvoiceImage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `InvoiceImage` table. All the data in the column will be lost.
  - You are about to drop the column `belongsTo` on the `SavedClient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvoiceImage" DROP CONSTRAINT "InvoiceImage_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedClient" DROP CONSTRAINT "SavedClient_belongsTo_fkey";

-- AlterTable
ALTER TABLE "InvoiceImage" DROP COLUMN "clientId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "SavedClient" DROP COLUMN "belongsTo";

-- CreateTable
CREATE TABLE "Invoices" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "vat" DOUBLE PRECISION NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "invoiceItems" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSavedClient" (
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "UserSavedClient_pkey" PRIMARY KEY ("userId","clientId")
);

-- CreateTable
CREATE TABLE "UserInvoices" (
    "userId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "UserInvoices_pkey" PRIMARY KEY ("userId","invoiceId")
);

-- AddForeignKey
ALTER TABLE "InvoiceImage" ADD CONSTRAINT "InvoiceImage_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "SavedClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedClient" ADD CONSTRAINT "UserSavedClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedClient" ADD CONSTRAINT "UserSavedClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "SavedClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvoices" ADD CONSTRAINT "UserInvoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvoices" ADD CONSTRAINT "UserInvoices_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
