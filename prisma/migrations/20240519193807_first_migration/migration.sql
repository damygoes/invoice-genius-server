-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('private', 'business');

-- CreateEnum
CREATE TYPE "Services" AS ENUM ('receiptManagement', 'subscriptionManagement', 'invoicing');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "mobile" TEXT,
    "profilePicture" TEXT,
    "address" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'private',
    "selectedServices" "Services"[],
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
