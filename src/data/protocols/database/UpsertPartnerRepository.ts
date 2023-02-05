import { UpsertPartnerModel } from '@domain/models';

export interface UpsertPartnerRepository {
  upsert(data: UpsertPartnerModel): Promise<void>;
}
