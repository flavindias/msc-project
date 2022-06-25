/*
  Warnings:

  - The `deezerId` column on the `Artist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `DeezerArtist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "DeezerArtist" DROP CONSTRAINT "DeezerArtist_id_fkey";

-- DropForeignKey
ALTER TABLE "SpotifyArtist" DROP CONSTRAINT "SpotifyArtist_id_fkey";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "deezerId",
ADD COLUMN     "deezerId" INTEGER;

-- AlterTable
ALTER TABLE "DeezerArtist" DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Artist_deezerId_key" ON "Artist"("deezerId");

-- CreateIndex
CREATE UNIQUE INDEX "DeezerArtist_id_key" ON "DeezerArtist"("id");

-- AddForeignKey
ALTER TABLE "DeezerArtist" ADD CONSTRAINT "DeezerArtist_id_fkey" FOREIGN KEY ("id") REFERENCES "Artist"("deezerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyArtist" ADD CONSTRAINT "SpotifyArtist_id_fkey" FOREIGN KEY ("id") REFERENCES "Artist"("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE;
