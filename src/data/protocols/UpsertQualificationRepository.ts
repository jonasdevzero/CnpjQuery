import { UpsertQualificationModel } from '../../domain/models/Qualification';

export interface UpsertQualificationRepository {
  upsert(data: UpsertQualificationModel): Promise<void>;
}
