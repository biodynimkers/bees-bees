-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bijenstand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bijenstand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kast" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "volktype" TEXT NOT NULL,
    "bijenstandId" INTEGER NOT NULL,

    CONSTRAINT "Kast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observatie" (
    "id" SERIAL NOT NULL,
    "kastId" INTEGER NOT NULL,
    "aantalBijen" INTEGER NOT NULL,
    "kleurStuifmeel" TEXT NOT NULL,
    "opmerkingen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Observatie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bijenstand" ADD CONSTRAINT "Bijenstand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kast" ADD CONSTRAINT "Kast_bijenstandId_fkey" FOREIGN KEY ("bijenstandId") REFERENCES "Bijenstand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observatie" ADD CONSTRAINT "Observatie_kastId_fkey" FOREIGN KEY ("kastId") REFERENCES "Kast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
