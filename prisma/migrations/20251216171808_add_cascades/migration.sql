-- DropForeignKey
ALTER TABLE "public"."Apiary" DROP CONSTRAINT "Apiary_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApiaryPlant" DROP CONSTRAINT "ApiaryPlant_apiaryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApiaryPlant" DROP CONSTRAINT "ApiaryPlant_plantId_fkey";

-- AddForeignKey
ALTER TABLE "Apiary" ADD CONSTRAINT "Apiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiaryPlant" ADD CONSTRAINT "ApiaryPlant_apiaryId_fkey" FOREIGN KEY ("apiaryId") REFERENCES "Apiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiaryPlant" ADD CONSTRAINT "ApiaryPlant_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
