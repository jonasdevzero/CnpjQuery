import { UpsertReasonRepository } from '@data/protocols';
import { UpsertReasonModel } from '@domain/models';
import sql from '../../db';

export class UpsertReasonPostgresRepository implements UpsertReasonRepository {
  async upsert(data: UpsertReasonModel): Promise<void> {
    const { code, description } = data;

    await sql`
      INSERT INTO reason (code, description)
      VALUES (${code}, ${description})
      ON CONFLICT (code) DO
      UPDATE SET description = ${description};
    `;
  }
}
