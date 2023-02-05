import { UpsertCompanyModel } from '@domain/models';

export interface UpsertCompanyRepository {
  upsert(data: UpsertCompanyModel): Promise<void>;
}
