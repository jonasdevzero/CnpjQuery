import { UpsertCountryRepository } from '@data/protocols';
import { UpsertCityModel } from '@domain/models';
import sql from '@infra/db/postgres/connection';

export class UpsertCityPostgresRepository implements UpsertCountryRepository {
  async upsert(data: UpsertCityModel): Promise<void> {
    const { code, name } = data;

    await sql`
      INSERT INTO city (code, name)
      VALUES (${code}, ${name})
      ON CONFLICT (code) DO
      UPDATE SET name = ${name};
    `;
  }
}
