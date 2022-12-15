import { UpsertReasonModel } from '../../domain/models/Reason';

export interface UpsertReasonRepository {
  upsert(data: UpsertReasonModel): Promise<void>;
}
