import { UpsertLegalNatureModel } from '../../domain/models/LegalNature';

export interface UpsertLegalNatureRepository {
  upsert(data: UpsertLegalNatureModel): Promise<void>;
}
