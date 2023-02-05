import { UpsertCityModel } from '@domain/models';

export interface UpsertCityRepository {
  upsert(data: UpsertCityModel): Promise<void>;
}
