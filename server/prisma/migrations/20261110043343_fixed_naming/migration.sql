/*
  Warnings:

  - The primary key for the `ConversationParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profileIds` on the `ConversationParticipant` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `ConversationParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_pkey",
DROP COLUMN "profileIds",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("conversationId", "profileId");
