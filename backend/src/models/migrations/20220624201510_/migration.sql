/*
  Warnings:

  - Changed the type of `deezerId` on the `DeezerTrack` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DeezerTrack" DROP COLUMN "deezerId",
ADD COLUMN     "deezerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeezerTrack_deezerId_key" ON "DeezerTrack"("deezerId");
