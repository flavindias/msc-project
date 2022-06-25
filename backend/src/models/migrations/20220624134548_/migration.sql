/*
  Warnings:

  - You are about to drop the column `albumId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `deezerId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `Album` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeezerAlbum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpotifyAlbum` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[artistId]` on the table `Track` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistId` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeezerAlbum" DROP CONSTRAINT "DeezerAlbum_id_fkey";

-- DropForeignKey
ALTER TABLE "SpotifyAlbum" DROP CONSTRAINT "SpotifyAlbum_id_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_albumId_fkey";

-- DropIndex
DROP INDEX "Track_deezerId_key";

-- DropIndex
DROP INDEX "Track_spotifyId_key";

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "albumId",
DROP COLUMN "deezerId",
DROP COLUMN "spotifyId",
ADD COLUMN     "artistId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Album";

-- DropTable
DROP TABLE "DeezerAlbum";

-- DropTable
DROP TABLE "SpotifyAlbum";

-- CreateTable
CREATE TABLE "Contributors" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contributors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_artistId_key" ON "Track"("artistId");

-- AddForeignKey
ALTER TABLE "Contributors" ADD CONSTRAINT "Contributors_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributors" ADD CONSTRAINT "Contributors_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
