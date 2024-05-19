-- CreateEnum
CREATE TYPE "Services" AS ENUM ('receiptManagement', 'subscriptionManagement', 'invoicing');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "selectedServices" "Services"[];
