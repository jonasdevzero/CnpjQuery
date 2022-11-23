import { UpsertCompanyModel } from '../../domain/models/Company';

export interface UpsertCompanyRepository {
  upsert(data: UpsertCompanyModel): Promise<void>;
}
