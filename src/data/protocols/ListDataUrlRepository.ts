import { DataUrlModel } from '../../domain/models/DataUrl';

export interface ListDataUrlRepository {
  list(): Promise<DataUrlModel[]>;
}
