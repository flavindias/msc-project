/*
  Warnings:

  - You are about to drop the column `gainDb` on the `DeezerTrack` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trackId]` on the table `DeezerTrack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackId]` on the table `SpotifyTrack` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `preview` to the `DeezerTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `DeezerTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `SpotifyTrack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeezerTrack" DROP CONSTRAINT "DeezerTrack_id_fkey";

-- DropForeignKey
ALTER TABLE "SpotifyTrack" DROP CONSTRAINT "SpotifyTrack_id_fkey";

-- AlterTable
ALTER TABLE "DeezerTrack" DROP COLUMN "gainDb",
ADD COLUMN     "preview" TEXT NOT NULL,
ADD COLUMN     "trackId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SpotifyTrack" ADD COLUMN     "trackId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "UserTracks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "vote" "Vote" NOT NULL DEFAULT E'NEUTRAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeezerTrack_trackId_key" ON "DeezerTrack"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyTrack_trackId_key" ON "SpotifyTrack"("trackId");

-- AddForeignKey
ALTER TABLE "DeezerTrack" ADD CONSTRAINT "DeezerTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyTrack" ADD CONSTRAINT "SpotifyTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTracks" ADD CONSTRAINT "UserTracks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTracks" ADD CONSTRAINT "UserTracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
