-- CreateEnum
CREATE TYPE "DataUrlType" AS ENUM ('COMPANY', 'ESTABLISHMENT', 'SIMPLES', 'PARTNER', 'GENERAL');

-- CreateTable
CREATE TABLE "dataUrl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "DataUrlType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dataUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnpj" (
    "baseCnpj" TEXT NOT NULL,
    "cnpj" TEXT,

    CONSTRAINT "cnpj_pkey" PRIMARY KEY ("baseCnpj")
);

-- CreateTable
CREATE TABLE "cnpjCompany" (
    "baseCnpj" TEXT NOT NULL,
    "corporateName" TEXT NOT NULL,
    "legalNature" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "federativeEntity" TEXT,

    CONSTRAINT "cnpjCompany_pkey" PRIMARY KEY ("baseCnpj")
);

-- CreateTable
CREATE TABLE "cnpjEstablishment" (
    "baseCnpj" TEXT NOT NULL,
    "corporateName" TEXT,
    "cadasterStatus" TEXT NOT NULL,
    "cadasterStatusDate" TEXT NOT NULL,
    "cadasterStatusReason" TEXT NOT NULL,
    "activityStartAt" TEXT NOT NULL,
    "mainCnae" TEXT NOT NULL,
    "secondaryCnae" TEXT,
    "specialStatus" TEXT,
    "specialStatusDate" TEXT,
    "telephone1" TEXT NOT NULL,
    "telephone2" TEXT,
    "fax" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "cnpjEstablishment_pkey" PRIMARY KEY ("baseCnpj")
);

-- CreateTable
CREATE TABLE "cnpjEstablishmentAddress" (
    "id" TEXT NOT NULL,
    "baseCnpj" TEXT NOT NULL,
    "cityAbroad" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "streetDescription" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "cnpjEstablishmentAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnpjSimples" (
    "id" TEXT NOT NULL,
    "baseCnpj" TEXT NOT NULL,
    "identification" BOOLEAN NOT NULL,
    "identificationDate" TEXT,
    "exclusionDate" TEXT,
    "meiIdentification" BOOLEAN NOT NULL,
    "meiIdentificationDate" TEXT,
    "meiExclusionDate" TEXT,

    CONSTRAINT "cnpjSimples_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dataUrl_url_key" ON "dataUrl"("url");

-- CreateIndex
CREATE UNIQUE INDEX "cnpj_cnpj_key" ON "cnpj"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "cnpjEstablishmentAddress_baseCnpj_key" ON "cnpjEstablishmentAddress"("baseCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "cnpjSimples_baseCnpj_key" ON "cnpjSimples"("baseCnpj");

-- AddForeignKey
ALTER TABLE "cnpjCompany" ADD CONSTRAINT "cnpjCompany_baseCnpj_fkey" FOREIGN KEY ("baseCnpj") REFERENCES "cnpj"("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnpjEstablishment" ADD CONSTRAINT "cnpjEstablishment_baseCnpj_fkey" FOREIGN KEY ("baseCnpj") REFERENCES "cnpj"("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnpjEstablishmentAddress" ADD CONSTRAINT "cnpjEstablishmentAddress_baseCnpj_fkey" FOREIGN KEY ("baseCnpj") REFERENCES "cnpjEstablishment"("baseCnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnpjSimples" ADD CONSTRAINT "cnpjSimples_baseCnpj_fkey" FOREIGN KEY ("baseCnpj") REFERENCES "cnpj"("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE;
