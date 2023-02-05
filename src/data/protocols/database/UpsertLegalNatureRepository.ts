import { UpsertLegalNatureModel } from '@domain/models';

export interface UpsertLegalNatureRepository {
  upsert(data: UpsertLegalNatureModel): Promise<void>;
}
