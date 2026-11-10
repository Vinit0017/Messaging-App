/*
  Warnings:

  - You are about to drop the column `userId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ConversationParticipant` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileIds` to the `ConversationParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ConversationParticipant" DROP COLUMN "userId",
ADD COLUMN     "profileIds" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "displayName" SET DEFAULT 'YOU';

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
