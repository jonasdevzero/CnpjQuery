import { UpsertCnaeModel } from '@domain/models';

export interface UpsertCnaeRepository {
  upsert(data: UpsertCnaeModel): Promise<void>;
}
