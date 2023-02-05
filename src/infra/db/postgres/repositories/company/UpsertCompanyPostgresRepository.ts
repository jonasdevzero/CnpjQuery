import { UpsertCompanyRepository } from '@data/protocols';
import { UpsertCompanyModel } from '../../../../../domain/models/Company';
import sql from '../../db';

export class UpsertCompanyPostgresRepository implements UpsertCompanyRepository {
  async upsert(data: UpsertCompanyModel): Promise<void> {
    const {
      baseCnpj,
      corporateName,
      legalNatureCode,
      qualification,
      capital,
      size,
      federativeEntity,
    } = data;

    await sql`
      INSERT INTO "company" ("baseCnpj", "corporateName", "legalNatureCode", "qualification", "capital", "size", "federativeEntity")
      VALUES (${baseCnpj}, ${corporateName}, ${legalNatureCode}, ${qualification},
        ${capital}, ${size}, ${federativeEntity})
      ON CONFLICT ("baseCnpj") DO
      UPDATE SET "corporateName" = ${corporateName}, "legalNatureCode" = ${legalNatureCode}, "qualification" = ${qualification},
        "capital" = ${capital}, "size" = ${size}, "federativeEntity" = ${federativeEntity}
      WHERE "company"."baseCnpj" = ${baseCnpj};
    `;
  }
}
