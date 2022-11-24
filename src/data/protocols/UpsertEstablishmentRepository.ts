import { UpsertEstablishmentModel } from '../../domain/models/Establishment';

export interface UpsertEstablishmentRepository {
  upsert(data: UpsertEstablishmentModel): Promise<void>;
}
