import { UpsertCountryRepository } from '../../../../../data/protocols/UpsertCountryRepository';
import { UpsertCityModel } from '../../../../../domain/models/City';
import sql from '../../db';

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
