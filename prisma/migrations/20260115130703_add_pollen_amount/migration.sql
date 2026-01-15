/*
  Warnings:

  - Added the required column `pollenAmount` to the `Observation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PollenAmount" AS ENUM ('WEINIG', 'GEMIDDELD', 'VEEL');

-- AlterTable
ALTER TABLE "Observation" ADD COLUMN     "pollenAmount" "PollenAmount" NOT NULL;
