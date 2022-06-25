/*
  Warnings:

  - You are about to drop the column `diskNumber` on the `DeezerTrack` table. All the data in the column will be lost.
  - You are about to drop the column `trackPosition` on the `DeezerTrack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeezerTrack" DROP COLUMN "diskNumber",
DROP COLUMN "trackPosition";
