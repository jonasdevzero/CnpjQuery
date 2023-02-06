import { UpsertCnaeRepository } from '@data/protocols';
import { UpsertCnaeModel } from '@domain/models';
import sql from '@infra/db/postgres/connection';

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
