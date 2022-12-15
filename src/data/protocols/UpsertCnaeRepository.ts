import { UpsertCnaeModel } from '../../domain/models/Cnae';

export interface UpsertCnaeRepository {
  upsert(data: UpsertCnaeModel): Promise<void>;
}
