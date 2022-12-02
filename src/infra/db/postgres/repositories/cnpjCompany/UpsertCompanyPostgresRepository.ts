import { UpsertCompanyRepository } from '../../../../../data/protocols/UpsertCompanyRepository';
import { UpsertCompanyModel } from '../../../../../domain/models/Company';
import sql from '../../db';

export class UpsertCompanyPostgresRepository implements UpsertCompanyRepository {
  async upsert(data: UpsertCompanyModel): Promise<void> {
    const { baseCnpj } = data;

    await sql`SELECT 1 FROM "cnpjCompany" WHERE "baseCnpj" = ${baseCnpj};`;
  }
}
