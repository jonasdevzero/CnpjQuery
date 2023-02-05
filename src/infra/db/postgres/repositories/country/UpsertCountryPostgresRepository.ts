import { UpsertCountryRepository } from '@data/protocols';
import { UpsertCountryModel } from '@domain/models';
import sql from '../../db';

export class UpsertCountryPostgresRepository implements UpsertCountryRepository {
  async upsert(data: UpsertCountryModel): Promise<void> {
    const { code, name } = data;

    await sql`
      INSERT INTO country (code, name)
      VALUES (${code}, ${name})
      ON CONFLICT (code) DO
      UPDATE SET name = ${name};
    `;
  }
}
