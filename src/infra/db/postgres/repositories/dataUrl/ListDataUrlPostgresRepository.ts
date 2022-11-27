import { ListDataUrlRepository } from '../../../../../data/protocols/ListDataUrlRepository';
import { DataUrlModel } from '../../../../../domain/models/DataUrl';
import sql from '../../db';

export class ListDataUrlPostgresRepository implements ListDataUrlRepository {
  async list(): Promise<DataUrlModel[]> {
    const result = await sql<DataUrlModel[]>`SELECT * FROM "dataUrl"`;
    return result;
  }
}
