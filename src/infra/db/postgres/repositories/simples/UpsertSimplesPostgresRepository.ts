import { PostgresError } from 'postgres';
import { UpsertSimplesRepository } from '@data/protocols';
import { UpsertSimplesModel } from '@domain/models';
import sql from '../../db';

export class UpsertSimplesPostgresRepository implements UpsertSimplesRepository {
  async upsert(data: UpsertSimplesModel): Promise<void> {
    const {
      baseCnpj,
      isSimples,
      simplesSince,
      simplesExclusionDate,
      isMei,
      meiSince,
      meiExclusionDate,
    } = data;

    try {
      await sql`
        INSERT INTO "simples" ("baseCnpj", "isSimples", "simplesSince", "simplesExclusionDate", "isMei", "meiSince", "meiExclusionDate")
        VALUES (${baseCnpj}, ${isSimples}, ${simplesSince}, ${simplesExclusionDate}, ${isMei}, ${meiSince}, ${meiExclusionDate})
        ON CONFLICT ("baseCnpj") DO
        UPDATE SET
          "isSimples" = ${isSimples}, "simplesSince" = ${simplesSince}, "simplesExclusionDate" = ${simplesExclusionDate},
          "isMei" = ${isMei}, "meiSince" = ${meiSince}, "meiExclusionDate" = ${meiExclusionDate}
        WHERE "simples"."baseCnpj" = ${baseCnpj};
      `;
    } catch (error) {
      const err = error as PostgresError;
      if (/violates foreign key constraint/g.test(err.message)) return;

      throw error;
    }
  }
}
