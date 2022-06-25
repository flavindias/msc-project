/*
  Warnings:

  - You are about to drop the column `deezerId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `DeezerArtist` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `DeezerTrack` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SpotifyArtist` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SpotifyTrack` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[artistId]` on the table `DeezerArtist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deezerId]` on the table `DeezerArtist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deezerId]` on the table `DeezerTrack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artistId]` on the table `SpotifyArtist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotifyId]` on the table `SpotifyArtist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotifyId]` on the table `SpotifyTrack` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistId` to the `DeezerArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deezerId` to the `DeezerArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deezerId` to the `DeezerTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistId` to the `SpotifyArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `SpotifyArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `SpotifyTrack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeezerArtist" DROP CONSTRAINT "DeezerArtist_id_fkey";

-- DropForeignKey
ALTER TABLE "SpotifyArtist" DROP CONSTRAINT "SpotifyArtist_id_fkey";

-- DropIndex
DROP INDEX "Artist_deezerId_key";

-- DropIndex
DROP INDEX "Artist_spotifyId_key";

-- DropIndex
DROP INDEX "DeezerArtist_id_key";

-- DropIndex
DROP INDEX "DeezerTrack_id_key";

-- DropIndex
DROP INDEX "SpotifyArtist_id_key";

-- DropIndex
DROP INDEX "SpotifyTrack_id_key";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "deezerId",
DROP COLUMN "spotifyId";

-- AlterTable
ALTER TABLE "DeezerArtist" DROP COLUMN "id",
ADD COLUMN     "artistId" TEXT NOT NULL,
ADD COLUMN     "deezerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DeezerTrack" DROP COLUMN "id",
ADD COLUMN     "deezerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SpotifyArtist" DROP COLUMN "id",
ADD COLUMN     "artistId" TEXT NOT NULL,
ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SpotifyTrack" DROP COLUMN "id",
ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeezerArtist_artistId_key" ON "DeezerArtist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "DeezerArtist_deezerId_key" ON "DeezerArtist"("deezerId");

-- CreateIndex
CREATE UNIQUE INDEX "DeezerTrack_deezerId_key" ON "DeezerTrack"("deezerId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyArtist_artistId_key" ON "SpotifyArtist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyArtist_spotifyId_key" ON "SpotifyArtist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyTrack_spotifyId_key" ON "SpotifyTrack"("spotifyId");

-- AddForeignKey
ALTER TABLE "DeezerArtist" ADD CONSTRAINT "DeezerArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyArtist" ADD CONSTRAINT "SpotifyArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
