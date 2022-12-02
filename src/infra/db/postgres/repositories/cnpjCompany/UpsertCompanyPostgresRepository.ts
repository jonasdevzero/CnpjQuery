import { UpsertCompanyRepository } from '../../../../../data/protocols/UpsertCompanyRepository';
import { UpsertCompanyModel } from '../../../../../domain/models/Company';
import sql from '../../db';

export class UpsertCompanyPostgresRepository implements UpsertCompanyRepository {
  async upsert(data: UpsertCompanyModel): Promise<void> {
    const { baseCnpj, corporateName, legalNature, qualification, capital, size, federativeEntity } =
      data;

    await sql`SELECT 1 FROM "cnpjCompany" WHERE "baseCnpj" = ${baseCnpj};`;

    await sql`
      INSERT INTO "cnpjCompany"  ("baseCnpj", "corporateName", "legalNature", qualification, capital, size, "federativeEntity")
        VALUES (${baseCnpj}, ${corporateName}, ${legalNature}, ${qualification}, ${capital}, ${size},
            ${federativeEntity || ''});
    `;
  }
}
