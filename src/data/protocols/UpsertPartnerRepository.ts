import { UpsertPartnerModel } from '../../domain/models/Partner';

export interface UpsertPartnerRepository {
  upsert(data: UpsertPartnerModel): Promise<void>;
}
