-- CreateEnum
CREATE TYPE "RecurringInterval" AS ENUM ('monthly', 'quarterly', 'yearly');

-- CreateTable
CREATE TABLE "SubscriptionsService" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionName" TEXT NOT NULL,
    "subscriptionCategory" TEXT NOT NULL,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringInterval" "RecurringInterval",
    "subscribedOn" TIMESTAMP(3) NOT NULL,
    "expiresOn" TIMESTAMP(3) NOT NULL,
    "setReminder" BOOLEAN NOT NULL DEFAULT false,
    "reminderPeriod" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionsService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionsService_userId_key" ON "SubscriptionsService"("userId");

-- AddForeignKey
ALTER TABLE "SubscriptionsService" ADD CONSTRAINT "SubscriptionsService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
