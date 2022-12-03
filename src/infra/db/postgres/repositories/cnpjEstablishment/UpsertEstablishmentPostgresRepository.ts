import { UpsertEstablishmentRepository } from '../../../../../data/protocols/UpsertEstablishmentRepository';
import { UpsertEstablishmentModel } from '../../../../../domain/models/Establishment';
import sql from '../../db';

export class UpsertEstablishmentPostgresRepository implements UpsertEstablishmentRepository {
  async upsert(data: UpsertEstablishmentModel): Promise<void> {
    const { cnpj } = data;

    await sql`SELECT 1 FROM "cnpjEstablishment" WHERE "cnpj" = ${cnpj};`;
  }
}
