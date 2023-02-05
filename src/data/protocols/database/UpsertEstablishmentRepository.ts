import { UpsertEstablishmentModel } from '@domain/models';

export interface UpsertEstablishmentRepository {
  upsert(data: UpsertEstablishmentModel): Promise<void>;
}
