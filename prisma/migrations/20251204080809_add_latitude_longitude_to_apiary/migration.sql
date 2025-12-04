/*
  Warnings:

  - You are about to drop the column `location` on the `Apiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apiary" DROP COLUMN "location",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
