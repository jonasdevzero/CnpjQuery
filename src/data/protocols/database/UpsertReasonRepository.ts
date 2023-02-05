import { UpsertReasonModel } from '@domain/models';

export interface UpsertReasonRepository {
  upsert(data: UpsertReasonModel): Promise<void>;
}
