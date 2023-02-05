import { UpsertQualificationModel } from '@domain/models';

export interface UpsertQualificationRepository {
  upsert(data: UpsertQualificationModel): Promise<void>;
}
