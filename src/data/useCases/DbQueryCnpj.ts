import { DataUrlModel } from '../../domain/models/DataUrl';
import { QueryCnpj } from '../../domain/useCases/QueryCnpj';
import { ZipLoader } from '../../presentation/protocols/ZipLoader';
import { ListDataUrlRepository } from '../protocols/ListDataUrlRepository';

export class DbQueryCnpj implements QueryCnpj {
  private readonly listDataUrlRepository: ListDataUrlRepository;
  private readonly zipLoader: ZipLoader;

  constructor(
    listDataUrlRepository: ListDataUrlRepository,
    zipLoader: ZipLoader,
  ) {
    this.listDataUrlRepository = listDataUrlRepository;
    this.zipLoader = zipLoader;
  }

  async query(): Promise<void> {
    const dataUrls = await this.listDataUrlRepository.list();

    await Promise.all(dataUrls.map((dataUrl) => this.loadDataUrl(dataUrl)));
  }

  private async loadDataUrl(dataUrl: DataUrlModel) {
    await this.zipLoader.load(dataUrl.url);
  }
}
