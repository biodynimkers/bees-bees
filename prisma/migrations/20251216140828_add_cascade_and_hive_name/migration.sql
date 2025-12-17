-- DropForeignKey
ALTER TABLE "public"."Hive" DROP CONSTRAINT "Hive_apiaryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Observation" DROP CONSTRAINT "Observation_hiveId_fkey";

-- AlterTable
ALTER TABLE "Hive" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Onbekend';

-- AddForeignKey
ALTER TABLE "Hive" ADD CONSTRAINT "Hive_apiaryId_fkey" FOREIGN KEY ("apiaryId") REFERENCES "Apiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;
