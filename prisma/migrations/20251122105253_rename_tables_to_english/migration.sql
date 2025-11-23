/*
  Warnings:

  - You are about to drop the `Bijenstand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kast` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Observatie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bijenstand" DROP CONSTRAINT "Bijenstand_userId_fkey";

-- DropForeignKey
ALTER TABLE "Kast" DROP CONSTRAINT "Kast_bijenstandId_fkey";

-- DropForeignKey
ALTER TABLE "Observatie" DROP CONSTRAINT "Observatie_kastId_fkey";

-- DropTable
DROP TABLE "Bijenstand";

-- DropTable
DROP TABLE "Kast";

-- DropTable
DROP TABLE "Observatie";

-- CreateTable
CREATE TABLE "Apiary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Apiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hive" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "colonyType" TEXT NOT NULL,
    "apiaryId" INTEGER NOT NULL,

    CONSTRAINT "Hive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" SERIAL NOT NULL,
    "hiveId" INTEGER NOT NULL,
    "beeCount" INTEGER NOT NULL,
    "pollenColor" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Apiary" ADD CONSTRAINT "Apiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hive" ADD CONSTRAINT "Hive_apiaryId_fkey" FOREIGN KEY ("apiaryId") REFERENCES "Apiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
