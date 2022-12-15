import { UpsertCountryModel } from '../../domain/models/Country';

export interface UpsertCountryRepository {
  upsert(data: UpsertCountryModel): Promise<void>;
}
