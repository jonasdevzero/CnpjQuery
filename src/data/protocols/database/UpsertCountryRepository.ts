import { UpsertCountryModel } from 'domain/models';

export interface UpsertCountryRepository {
  upsert(data: UpsertCountryModel): Promise<void>;
}
