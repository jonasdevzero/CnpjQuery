import { PgSql, Migration } from '../protocols';

export default class InitMigration implements Migration {
  async up(sql: PgSql): Promise<void> {
    await sql.begin(async (transactionSql) => {
      await transactionSql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

      await transactionSql`
        DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE pg_type.typname = 'DataUrlType') THEN
                CREATE TYPE "DataUrlType" AS ENUM ('COMPANY', 'ESTABLISHMENT', 'SIMPLES', 'PARTNER', 'GENERAL');
            END IF;
          END
        $$;
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "dataUrl" (
          "id" uuid DEFAULT uuid_generate_v4 (),
          "url" TEXT NOT NULL,
          "type" "DataUrlType" NOT NULL,
          PRIMARY KEY ("id")
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpj" (
          "baseCnpj" VARCHAR(20) NOT NULL,
          "cnpj" VARCHAR(20),
          PRIMARY KEY ("baseCnpj")
        );    
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpjCompany" (
          "baseCnpj" VARCHAR(20) NOT NULL,
          "corporateName" TEXT NOT NULL,
          "legalNature" TEXT NOT NULL,
          "qualification" TEXT NOT NULL,
          "capital" TEXT NOT NULL,
          "size" TEXT NOT NULL,
          "federativeEntity" TEXT,
          PRIMARY KEY ("baseCnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES cnpj("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpjEstablishment" (
          "baseCnpj" VARCHAR(20) NOT NULL,
          "corporateName" TEXT,
          "cadasterStatus" VARCHAR(10) NOT NULL,
          "cadasterStatusDate" TEXT NOT NULL,
          "cadasterStatusReason" TEXT,
          "activityStartAt" TEXT,
          "mainCnae" VARCHAR(20),
          "secondaryCnae" VARCHAR(20),
          "specialStatus" TEXT,
          "specialStatusDate" TEXT,
          "telephone1" VARCHAR(30),
          "telephone2" VARCHAR(30),
          "fax" VARCHAR(30),
          "email" TEXT,
          PRIMARY KEY ("baseCnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES cnpj("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpjEstablishmentAddress" (
          "baseCnpj" VARCHAR(20) NOT NULL,
          "cityAbroad" TEXT,
          "countryCode" TEXT,
          "streetDescription" TEXT,
          "street" TEXT,
          "number" TEXT,
          "complement" TEXT,
          "district" TEXT,
          "cep" TEXT,
          "uf" TEXT,
          "city" TEXT,
          PRIMARY KEY ("baseCnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES cnpj("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpjSimples" (
          "baseCnpj" VARCHAR(20) NOT NULL,
          "identification" BIT NOT NULL,
          "identificationDate" TEXT,
          "exclusionDate" TEXT,
          "meiIdentification" BIT NOT NULL,
          "meiIdentificationDate" TEXT,
          "meiExclusionDate" TEXT,
          PRIMARY KEY ("baseCnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES cnpj("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

      await transactionSql`
          CREATE TABLE IF NOT EXISTS "cnpjPartner" (
            "id" uuid DEFAULT uuid_generate_v4 (),
            "baseCnpj" VARCHAR(20) NOT NULL,
            "identifier" TEXT,
            "name" TEXT,
            "registration" TEXT UNIQUE,
            "qualification" TEXT,
            "countryCode" TEXT,
            "legalRepresentativeCpf" TEXT,
            "legalRepresentativeName" TEXT,
            "legalRepresentativeQualification" TEXT,
            "ageGroup" TEXT,
            "entryDate" TEXT,
            PRIMARY KEY ("id"),
            FOREIGN KEY ("baseCnpj") REFERENCES cnpj("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
          );
      `;
    });
  }

  async down(sql: PgSql): Promise<void> {
    await sql`DROP TABLE IF EXISTS "cnpjPartner";`;
    await sql`DROP TABLE IF EXISTS "cnpjSimples";`;
    await sql`DROP TABLE IF EXISTS "cnpjEstablishmentAddress";`;
    await sql`DROP TABLE IF EXISTS "cnpjEstablishment";`;
    await sql`DROP TABLE IF EXISTS "cnpjCompany";`;
    await sql`DROP TABLE IF EXISTS "cnpj";`;
    await sql`DROP TABLE IF EXISTS "dataUrl";`;
    await sql`DROP TYPE IF EXISTS "DataUrlType";`;
    await sql`DROP EXTENSION IF EXISTS "uuid-ossp";`;
  }
}
