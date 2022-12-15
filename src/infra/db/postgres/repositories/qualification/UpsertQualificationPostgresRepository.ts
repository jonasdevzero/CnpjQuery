import { UpsertQualificationRepository } from '../../../../../data/protocols/UpsertQualificationRepository';
import { UpsertQualificationModel } from '../../../../../domain/models/Qualification';
import sql from '../../db';

export class UpsertQualificationPostgresRepository implements UpsertQualificationRepository {
  async upsert(data: UpsertQualificationModel): Promise<void> {
    const { code, description } = data;

    await sql`
      INSERT INTO qualification (code, description)
      VALUES (${code}, ${description})
      ON CONFLICT (code) DO
      UPDATE SET description = ${description};
    `;
  }
}
