import { UpsertCompanyModel } from '../../domain/models/Company';
import { DataUrlModel, DataUrlType } from '../../domain/models/DataUrl';
import { QueryCnpj } from '../../domain/useCases/QueryCnpj';
import { ZipLoader } from '../../presentation/protocols/ZipLoader';
import { ListDataUrlRepository } from '../protocols/ListDataUrlRepository';
import { UpsertCompanyRepository } from '../protocols/UpsertCompanyRepository';

export class DbQueryCnpj implements QueryCnpj {
  private readonly listDataUrlRepository: ListDataUrlRepository;
  private readonly zipLoader: ZipLoader;
  private readonly upsertCompanyRepository: UpsertCompanyRepository;

  private readonly parsers = {
    COMPANY: this.parseCompanyData,
  } as {
    [key in DataUrlType]: (data: string[]) => any;
  };

  constructor(
    listDataUrlRepository: ListDataUrlRepository,
    zipLoader: ZipLoader,
    upsertCompanyRepository: UpsertCompanyRepository,
  ) {
    this.listDataUrlRepository = listDataUrlRepository;
    this.zipLoader = zipLoader;
    this.upsertCompanyRepository = upsertCompanyRepository;
  }

  async query(): Promise<void> {
    const dataUrls = await this.listDataUrlRepository.list();

    await Promise.all(dataUrls.map((dataUrl) => this.loadDataUrl(dataUrl)));
  }

  private async loadDataUrl(dataUrl: DataUrlModel) {
    const stream = await this.zipLoader.load(dataUrl.url);

    stream.on('data', (data) => {
      const dataToParse = data.replace(/"/g, '').split(';');

      const parser = this.parsers[dataUrl.type];
      const parsedData = parser(dataToParse);

      this.upsertCompanyRepository.upsert(parsedData);
    });

    stream.on('error', () => {});
  }

  private parseData(data: string, type: DataUrlType) {
    // ...
  }

  private parseCompanyData(data: string[]): UpsertCompanyModel {
    const [
      baseCnpj,
      corporateName,
      legalNature,
      qualification,
      capital,
      size,
      federativeEntity,
    ] = data;

    return {
      baseCnpj,
      corporateName,
      legalNature,
      qualification,
      capital,
      size,
      federativeEntity,
    };
  }
}
