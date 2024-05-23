/*
  Warnings:

  - You are about to drop the column `businessAddress` on the `User` table. All the data in the column will be lost.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "businessAddress",
ADD COLUMN     "address" JSONB NOT NULL;
