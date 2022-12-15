import { PgSql, Migration } from '../protocols';

export default class InitMigration implements Migration {
  async up(sql: PgSql): Promise<void> {
    await sql.begin(async (transactionSql) => {
      await transactionSql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

      await transactionSql`
        DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE pg_type.typname = 'DataUrlType') THEN
                CREATE TYPE "DataUrlType" AS ENUM ('COMPANY', 'ESTABLISHMENT', 'SIMPLES', 'PARTNER', 'COUNTRIES', 'CITIES', 'CNAE', 'REASONS', 'NATURES', 'QUALIFICATIONS');
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
        CREATE TABLE IF NOT EXISTS country (
          code TEXT NOT NULL,
          name TEXT NOT NULL,
          PRIMARY KEY (code)
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS city (
          code TEXT NOT NULL,
          name TEXT NOT NULL,
          PRIMARY KEY (code)
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS qualification (
          code TEXT NOT NULL,
          description TEXT NOT NULL,
          PRIMARY KEY (code)
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS reason (
          code TEXT NOT NULL,
          description TEXT NOT NULL,
          PRIMARY KEY (code)
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "legalNature" (
          code TEXT NOT NULL,
          description TEXT NOT NULL,
          PRIMARY KEY (code)
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS cnae (
          code TEXT NOT NULL,
          description TEXT NOT NULL,
          PRIMARY KEY (code)
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "company" (
          "baseCnpj" TEXT NOT NULL,
          "corporateName" TEXT NOT NULL,
          "legalNatureCode" TEXT NOT NULL,
          "qualification" TEXT NOT NULL,
          "capital" TEXT NOT NULL,
          "size" TEXT NOT NULL,
          "federativeEntity" TEXT,
          PRIMARY KEY ("baseCnpj"),
          FOREIGN KEY ("legalNatureCode") REFERENCES "legalNature"("code")
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "establishment" (
          "cnpj" TEXT NOT NULL,
          "baseCnpj" TEXT NOT NULL,
          "fantasyName" TEXT,
          "cadasterStatus" TEXT NOT NULL,
          "cadasterStatusDate" TEXT NOT NULL,
          "cadasterStatusReason" TEXT,
          "activityStartAt" TEXT,
          "mainCnae" TEXT,
          "secondaryCnae" TEXT,
          "specialStatus" TEXT,
          "specialStatusDate" TEXT,
          "telephone1" TEXT,
          "telephone2" TEXT,
          "fax" TEXT,
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
          "cityCode" TEXT,
          PRIMARY KEY ("cnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES "company"("baseCnpj"),
          FOREIGN KEY ("countryCode") REFERENCES "country"("code"),
          FOREIGN KEY ("cityCode") REFERENCES "city"("code"),
          FOREIGN KEY ("cadasterStatusReason") REFERENCES "reason"("code"),
          FOREIGN KEY ("mainCnae") REFERENCES "cnae"("code")
        );
      `;

      await transactionSql`
        CREATE TABLE IF NOT EXISTS "simples" (
          "baseCnpj" VARCHAR(8) NOT NULL,
          "isSimples" BOOLEAN,
          "simplesSince" VARCHAR(8),
          "simplesExclusionDate" VARCHAR(8),
          "isMei" BOOLEAN,
          "meiSince" VARCHAR(8),
          "meiExclusionDate" VARCHAR(8),
          PRIMARY KEY ("baseCnpj"),
          FOREIGN KEY ("baseCnpj") REFERENCES "company"("baseCnpj")
        );
      `;

      await transactionSql`
          CREATE TABLE IF NOT EXISTS "partner" (
            "baseCnpj" TEXT NOT NULL,
            "identifier" TEXT,
            "name" TEXT,
            "cpf" TEXT,
            "qualificationCode" TEXT,
            "countryCode" TEXT,
            "legalRepresentativeCpf" TEXT,
            "legalRepresentativeName" TEXT,
            "legalRepresentativeQualification" TEXT,
            "ageGroup" TEXT,
            "entryDate" TEXT,
            PRIMARY KEY ("baseCnpj", "cpf"),
            FOREIGN KEY ("baseCnpj") REFERENCES "company"("baseCnpj"),
            FOREIGN KEY ("countryCode") REFERENCES "country"("code"),
            FOREIGN KEY ("qualificationCode") REFERENCES "qualification"("code")
          );
      `;

      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "dataUrl_url_key" ON "dataUrl"("url");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "country_code_key" ON "country"("code");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "city_code_key" ON "city"("code");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "qualification_code_key" ON "qualification"("code");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "reason_code_key" ON "reason"("code");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "legalNature_code_key" ON "legalNature"("code");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnae_code_key" ON "cnae"("code");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjCompany_baseCnpj_key" ON "company"("baseCnpj");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjEstablishment_cnpj_key" ON "establishment"("cnpj");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjSimples_baseCnpj_key" ON "simples"("baseCnpj");`;
      await transactionSql`CREATE UNIQUE INDEX IF NOT EXISTS "cnpjPartner_baseCnpj_cpf_key" ON "partner"("baseCnpj", "cpf");`;
    });
  }

  async down(sql: PgSql): Promise<void> {
    await sql`DROP TABLE IF EXISTS "dataUrl";`;
    await sql`DROP INDEX IF EXISTS "dataUrl_url_key";`;

    await sql`DROP INDEX IF EXISTS "country_code_key";`;
    await sql`DROP INDEX IF EXISTS "city_code_key";`;
    await sql`DROP INDEX IF EXISTS "qualification_code_key";`;
    await sql`DROP INDEX IF EXISTS "legalNature_code_key";`;
    await sql`DROP INDEX IF EXISTS "cnae_code_key";`;

    await sql`DROP INDEX IF EXISTS "cnpjCompany_baseCnpj_key";`;
    await sql`DROP INDEX IF EXISTS "cnpjEstablishment_cnpj_key";`;
    await sql`DROP INDEX IF EXISTS "cnpjSimples_baseCnpj_key";`;
    await sql`DROP INDEX IF EXISTS "cnpjPartner_baseCnpj_cpf_key";`;

    await sql`DROP TABLE IF EXISTS "partner";`;
    await sql`DROP TABLE IF EXISTS "simples";`;
    await sql`DROP TABLE IF EXISTS "establishment";`;
    await sql`DROP TABLE IF EXISTS "company";`;

    await sql`DROP TABLE IF EXISTS "cnae";`;
    await sql`DROP TABLE IF EXISTS "legalNature";`;
    await sql`DROP TABLE IF EXISTS "qualification";`;
    await sql`DROP TABLE IF EXISTS "city";`;
    await sql`DROP TABLE IF EXISTS "country";`;

    await sql`DROP TYPE IF EXISTS "DataUrlType";`;
    await sql`DROP EXTENSION IF EXISTS "uuid-ossp";`;
  }
}
