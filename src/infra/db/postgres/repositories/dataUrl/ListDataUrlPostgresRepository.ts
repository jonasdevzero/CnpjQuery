import { ListDataUrlRepository } from '@data/protocols';
import { DataUrlModel, DataUrlType } from '@domain/models';
import sql from '../../db';

export class ListDataUrlPostgresRepository implements ListDataUrlRepository {
  private readonly urlPriority = {
    COUNTRIES: 0,
    CITIES: 1,
    CNAE: 2,
    REASONS: 3,
    NATURES: 4,
    QUALIFICATIONS: 5,
    COMPANY: 6,
    ESTABLISHMENT: 7,
    SIMPLES: 8,
    PARTNER: 9,
  } as { [key in DataUrlType]: number };

  async list(): Promise<DataUrlModel[]> {
    const result = await sql<DataUrlModel[]>`SELECT * FROM "dataUrl"`;
    return this.sortUrls(result);
  }

  private sortUrls(urls: DataUrlModel[]): DataUrlModel[] {
    return urls.sort((url, urlToBeCompared) => {
      return this.getUrlPriority(url) - this.getUrlPriority(urlToBeCompared);
    });
  }

  private getUrlPriority(url: DataUrlModel) {
    return this.urlPriority[url.type];
  }
}
