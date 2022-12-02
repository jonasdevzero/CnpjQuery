import { PgSql, Migration } from '../protocols';

export default class InitMigration implements Migration {
  async up(sql: PgSql): Promise<void> {
    await sql.begin(async (transactionSql) => {
      await transactionSql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

      await transactionSql`
        DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE pg_type.typname = 'DataUrlType') THEN
                CREATE TYPE "DataUrlType" AS ENUM ('COMPANY', 'ESTABLISHMENT', 'SIMPLES', 'PARTNER', CNAE', COUNTRIES', QUALIFICATIONS', 'NATURES', 'CITIES', 'REASONS');
            END IF;
          END
        $$;
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "dataUrl" (
          "id" uuid DEFAULT uuid_generate_v4 (),
          "url" TEXT UNIQUE NOT NULL,
          "type" "DataUrlType" NOT NULL,
          PRIMARY KEY ("id")
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpjCompany" (
          "baseCnpj" TEXT NOT NULL,
          "corporateName" TEXT NOT NULL,
          "legalNature" TEXT NOT NULL,
          "qualification" TEXT NOT NULL,
          "capital" TEXT NOT NULL,
          "size" TEXT NOT NULL,
          "federativeEntity" TEXT,
          PRIMARY KEY ("baseCnpj")
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpjEstablishment" (
          "cnpj" TEXT NOT NULL,
          "baseCnpj" TEXT NOT NULL,
          "corporateName" TEXT,
          "cadasterStatus" VARCHAR(10) NOT NULL,
          "cadasterStatusDate" TEXT NOT NULL,
          "cadasterStatusReason" TEXT,
          "activityStartAt" TEXT,
          "mainCnae" TEXT,
          "secondaryCnae" TEXT,
          "specialStatus" TEXT,
          "specialStatusDate" TEXT,
          "telephone1" VARCHAR(30),
          "telephone2" VARCHAR(30),
          "fax" VARCHAR(30),
          "email" TEXT,
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
          PRIMARY KEY ("cnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES "cnpjCompany"("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "cnpjSimples" (
          "baseCnpj" TEXT NOT NULL,
          "identification" BIT NOT NULL,
          "identificationDate" TEXT,
          "exclusionDate" TEXT,
          "meiIdentification" BIT NOT NULL,
          "meiIdentificationDate" TEXT,
          "meiExclusionDate" TEXT,
          PRIMARY KEY ("baseCnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES "cnpjCompany"("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

      await transactionSql`
          CREATE TABLE IF NOT EXISTS "cnpjPartner" (
            "baseCnpj" TEXT NOT NULL,
            "identifier" TEXT,
            "name" TEXT,
            "cpf" TEXT,
            "qualification" TEXT,
            "countryCode" TEXT,
            "legalRepresentativeCpf" TEXT,
            "legalRepresentativeName" TEXT,
            "legalRepresentativeQualification" TEXT,
            "ageGroup" TEXT,
            "entryDate" TEXT,
            PRIMARY KEY ("baseCnpj", "cpf"),
            FOREIGN KEY ("baseCnpj") REFERENCES "cnpjCompany"("baseCnpj") ON DELETE CASCADE ON UPDATE CASCADE
          );
      `;

      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "dataUrl_url_key" ON "dataUrl"("url");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjCompany_baseCnpj_key" ON "cnpjCompany"("baseCnpj");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjEstablishment_cnpj_key" ON "cnpjEstablishment"("cnpj");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjSimples_baseCnpj_key" ON "cnpjSimples"("baseCnpj");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjPartner_baseCnpj_cpf_key" ON "cnpjPartner"("baseCnpj", "cpf");`;
    });
  }

  async down(sql: PgSql): Promise<void> {
    await sql`DROP INDEX IF EXISTS "dataUrl_url_key";`;
    await sql`DROP INDEX IF EXISTS "cnpjCompany_baseCnpj_key";`;
    await sql`DROP INDEX IF EXISTS "cnpjEstablishment_cnpj_key";`;
    await sql`DROP INDEX IF EXISTS "cnpjSimples_baseCnpj_key";`;
    await sql`DROP INDEX IF EXISTS "cnpjPartner_baseCnpj_cpf_key";`;

    await sql`DROP TABLE IF EXISTS "cnpjPartner";`;
    await sql`DROP TABLE IF EXISTS "cnpjSimples";`;
    await sql`DROP TABLE IF EXISTS "cnpjEstablishment";`;
    await sql`DROP TABLE IF EXISTS "cnpjCompany";`;
    await sql`DROP TABLE IF EXISTS "dataUrl";`;
    await sql`DROP TYPE IF EXISTS "DataUrlType";`;
    await sql`DROP EXTENSION IF EXISTS "uuid-ossp";`;
  }
}
