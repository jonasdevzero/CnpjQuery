import { UpsertLegalNatureRepository } from '@data/protocols';
import { UpsertLegalNatureModel } from '@domain/models';
import sql from '../../db';

export class UpsertLegalNaturePostgresRepository implements UpsertLegalNatureRepository {
  async upsert(data: UpsertLegalNatureModel): Promise<void> {
    const { code, description } = data;

    await sql`
      INSERT INTO "legalNature" (code, description)
      VALUES (${code}, ${description})
      ON CONFLICT (code) DO
      UPDATE SET description = ${description};
    `;
  }
}
