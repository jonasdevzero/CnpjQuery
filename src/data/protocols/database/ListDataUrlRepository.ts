import { DataUrlModel } from '@domain/models';

export interface ListDataUrlRepository {
  list(): Promise<DataUrlModel[]>;
}
