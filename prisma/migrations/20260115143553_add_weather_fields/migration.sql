-- CreateEnum
CREATE TYPE "WeatherCondition" AS ENUM ('SUNNY', 'PARTLY_CLOUDY', 'CLOUDY', 'RAINY', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Observation" ADD COLUMN     "temperature" DOUBLE PRECISION,
ADD COLUMN     "weatherCondition" "WeatherCondition" NOT NULL DEFAULT 'UNKNOWN',
ALTER COLUMN "pollenAmount" SET DEFAULT 'GEMIDDELD';
