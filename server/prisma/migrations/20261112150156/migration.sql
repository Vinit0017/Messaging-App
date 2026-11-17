/*
  Warnings:

  - You are about to drop the column `profileId` on the `Conversation` table. All the data in the column will be lost.
  - The primary key for the `ConversationParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profileId` on the `ConversationParticipant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ConversationParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_pkey",
DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("conversationId", "userId");

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "avatarUrl" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
