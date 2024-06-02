/*
  Warnings:

  - You are about to drop the column `userId` on the `SavedClient` table. All the data in the column will be lost.
  - Added the required column `belongsTo` to the `SavedClient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedClient" DROP CONSTRAINT "SavedClient_userId_fkey";

-- AlterTable
ALTER TABLE "SavedClient" DROP COLUMN "userId",
ADD COLUMN     "belongsTo" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SavedClient" ADD CONSTRAINT "SavedClient_belongsTo_fkey" FOREIGN KEY ("belongsTo") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
