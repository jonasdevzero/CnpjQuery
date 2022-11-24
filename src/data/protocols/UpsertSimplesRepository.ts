import { UpsertSimplesModel } from '../../domain/models/Simples';

export interface UpsertSimplesRepository {
  upsert(data: UpsertSimplesModel): Promise<void>;
}
