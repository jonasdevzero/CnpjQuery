import { UpsertLegalNatureRepository } from '../../../../../data/protocols/UpsertLegalNatureRepository';
import { UpsertLegalNatureModel } from '../../../../../domain/models/LegalNature';
import sql from '../../db';

export class UpsertLegalNaturePostgresRepository implements UpsertLegalNatureRepository {
  async upsert(data: UpsertLegalNatureModel): Promise<void> {
    const { code, description } = data;

    await sql`
      INSERT INTO city (code, description)
      VALUES (${code}, ${description})
      ON CONFLICT (code) DO
      UPDATE SET description = ${description};
    `;
  }
}
