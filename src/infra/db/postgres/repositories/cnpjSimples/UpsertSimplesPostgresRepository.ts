import { PostgresError } from 'postgres';
import { UpsertSimplesRepository } from '../../../../../data/protocols/UpsertSimplesRepository';
import { UpsertSimplesModel } from '../../../../../domain/models/Simples';
import sql from '../../db';

export class UpsertSimplesPostgresRepository implements UpsertSimplesRepository {
  async upsert(data: UpsertSimplesModel): Promise<void> {
    const {
      baseCnpj,
      identification,
      identificationDate,
      exclusionDate,
      meiIdentification,
      meiExclusionDate,
      meiIdentificationDate,
    } = data;

    try {
      await sql`
        INSERT INTO "cnpjSimples" ("baseCnpj", "identification", "identificationDate", "exclusionDate", "meiIdentification", "meiIdentificationDate", "meiExclusionDate")
        VALUES (${baseCnpj}, ${identification}, ${identificationDate}, ${exclusionDate}, ${meiIdentification}, ${meiIdentificationDate}, ${meiExclusionDate})
        ON CONFLICT ("baseCnpj") DO
        UPDATE SET
          "identification" = ${identification}, "identificationDate" = ${identificationDate}, "exclusionDate" = ${exclusionDate},
          "meiIdentification" = ${meiIdentification}, "meiIdentificationDate" = ${meiIdentificationDate}, "meiExclusionDate" = ${meiExclusionDate}
        WHERE "cnpjSimples"."baseCnpj" = ${baseCnpj};
      `;
    } catch (error) {
      const err = error as PostgresError;
      if (/violates foreign key constraint/g.test(err.message)) return;

      throw error;
    }
  }
}
