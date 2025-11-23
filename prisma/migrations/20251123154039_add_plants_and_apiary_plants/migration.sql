/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ForageIntensity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latinName" TEXT,
    "type" TEXT,
    "floweringStart" INTEGER,
    "floweringEnd" INTEGER,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiaryPlant" (
    "id" TEXT NOT NULL,
    "apiaryId" INTEGER NOT NULL,
    "plantId" INTEGER NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "intensity" "ForageIntensity",
    "customStart" INTEGER,
    "customEnd" INTEGER,

    CONSTRAINT "ApiaryPlant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiaryPlant" ADD CONSTRAINT "ApiaryPlant_apiaryId_fkey" FOREIGN KEY ("apiaryId") REFERENCES "Apiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiaryPlant" ADD CONSTRAINT "ApiaryPlant_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
