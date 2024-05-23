/*
  Warnings:

  - Added the required column `otpExpiration` to the `OTPStore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTPStore" ADD COLUMN     "otpExpiration" TIMESTAMP(3) NOT NULL;
