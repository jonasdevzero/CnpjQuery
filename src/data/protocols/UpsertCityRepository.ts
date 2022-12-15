import { UpsertCityModel } from '../../domain/models/City';

export interface UpsertCityRepository {
  upsert(data: UpsertCityModel): Promise<void>;
}
