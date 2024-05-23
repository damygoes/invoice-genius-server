-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('private', 'business');

-- CreateEnum
CREATE TYPE "Services" AS ENUM ('receiptManagement', 'subscriptionManagement', 'invoicing');

-- CreateEnum
CREATE TYPE "RecurringInterval" AS ENUM ('monthly', 'quarterly', 'yearly');

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
    "businessAddress" JSONB NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'private',
    "selectedServices" "Services"[],
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessUserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessLogo" TEXT,
    "businessWebsite" TEXT,
    "businessInfo" TEXT,
    "businessEmail" TEXT NOT NULL,
    "businessPhone" TEXT,
    "businessMobile" TEXT,
    "industry" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessAddress" JSONB NOT NULL,

    CONSTRAINT "BusinessUserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionsService" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionName" TEXT NOT NULL,
    "subscriptionCategory" TEXT NOT NULL,
    "recurringInterval" "RecurringInterval",
    "subscribedOn" TIMESTAMP(3) NOT NULL,
    "expiresOn" TIMESTAMP(3) NOT NULL,
    "setReminder" BOOLEAN NOT NULL DEFAULT false,
    "reminderPeriod" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionsService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTPStore" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otpExpiration" TIMESTAMP(3),

    CONSTRAINT "OTPStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessUserProfile_userId_key" ON "BusinessUserProfile"("userId");

-- CreateIndex
CREATE INDEX "SubscriptionsService_userId_idx" ON "SubscriptionsService"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OTPStore_email_key" ON "OTPStore"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "BusinessUserProfile" ADD CONSTRAINT "BusinessUserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionsService" ADD CONSTRAINT "SubscriptionsService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
