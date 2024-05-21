-- DropIndex
DROP INDEX "SubscriptionsService_userId_key";

-- CreateIndex
CREATE INDEX "SubscriptionsService_userId_idx" ON "SubscriptionsService"("userId");
