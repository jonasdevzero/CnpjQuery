import { UpsertCnaeRepository } from '../../../../../data/protocols/UpsertCnaeRepository';
import { UpsertCnaeModel } from '../../../../../domain/models/Cnae';
import sql from '../../db';

export class UpsertCnaePostgresRepository implements UpsertCnaeRepository {
  async upsert(data: UpsertCnaeModel): Promise<void> {
    const { code, description } = data;

    await sql`
      INSERT INTO cnae (code, description)
      VALUES (${code}, ${description})
      ON CONFLICT (code) DO
      UPDATE SET description = ${description};
    `;
  }
}
