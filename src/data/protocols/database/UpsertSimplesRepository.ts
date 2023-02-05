import { UpsertSimplesModel } from '@domain/models';

export interface UpsertSimplesRepository {
  upsert(data: UpsertSimplesModel): Promise<void>;
}
