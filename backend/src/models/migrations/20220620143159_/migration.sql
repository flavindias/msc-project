/*
  Warnings:

  - You are about to drop the column `name` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `explicit` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `Track` table. All the data in the column will be lost.
  - Added the required column `title` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "spotifyId" DROP NOT NULL,
ALTER COLUMN "deezerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "duration",
DROP COLUMN "explicit",
DROP COLUMN "popularity",
ADD COLUMN     "albumId" TEXT,
ALTER COLUMN "spotifyId" DROP NOT NULL,
ALTER COLUMN "deezerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DeezerArtist" (
    "id" TEXT NOT NULL,
    "radio" BOOLEAN NOT NULL,
    "link" TEXT NOT NULL,
    "share" TEXT NOT NULL,
    "tracklist" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SpotifyArtist" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DeezerTrack" (
    "id" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "readable" BOOLEAN NOT NULL,
    "gain" INTEGER,
    "duration" INTEGER NOT NULL,
    "trackPosition" INTEGER NOT NULL,
    "diskNumber" INTEGER NOT NULL,
    "explicitLyrics" BOOLEAN NOT NULL,
    "bpm" INTEGER NOT NULL,
    "gainDb" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "share" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SpotifyTrack" (
    "id" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "isLocal" BOOLEAN NOT NULL,
    "popularity" INTEGER NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DeezerAlbum" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "trackListLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SpotifyAlbum" (
    "id" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "DeezerArtist_id_key" ON "DeezerArtist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyArtist_id_key" ON "SpotifyArtist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeezerTrack_id_key" ON "DeezerTrack"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyTrack_id_key" ON "SpotifyTrack"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeezerAlbum_id_key" ON "DeezerAlbum"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyAlbum_id_key" ON "SpotifyAlbum"("id");

-- AddForeignKey
ALTER TABLE "DeezerArtist" ADD CONSTRAINT "DeezerArtist_id_fkey" FOREIGN KEY ("id") REFERENCES "Artist"("deezerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyArtist" ADD CONSTRAINT "SpotifyArtist_id_fkey" FOREIGN KEY ("id") REFERENCES "Artist"("deezerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeezerTrack" ADD CONSTRAINT "DeezerTrack_id_fkey" FOREIGN KEY ("id") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyTrack" ADD CONSTRAINT "SpotifyTrack_id_fkey" FOREIGN KEY ("id") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeezerAlbum" ADD CONSTRAINT "DeezerAlbum_id_fkey" FOREIGN KEY ("id") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyAlbum" ADD CONSTRAINT "SpotifyAlbum_id_fkey" FOREIGN KEY ("id") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
