import {
  QueryCnpj,
  ListDataUrlRepository,
  DataUrlModel,
  DataUrlType,
  ZipReader,
  UpsertCompanyRepository,
  UpsertEstablishmentRepository,
  UpsertSimplesRepository,
  CnpjRawDataParser,
} from './DbQueryCnpj.protocols';

export class DbQueryCnpj implements QueryCnpj {
  private readonly listDataUrlRepository: ListDataUrlRepository;
  private readonly zipLoader: ZipReader;
  private readonly upsertCompanyRepository: UpsertCompanyRepository;
  private readonly upsertEstablishmentRepository: UpsertEstablishmentRepository;
  private readonly upsertSimplesRepository: UpsertSimplesRepository;
  private readonly cnpjRawDataParser: CnpjRawDataParser;

  constructor(
    listDataUrlRepository: ListDataUrlRepository,
    zipLoader: ZipReader,
    upsertCompanyRepository: UpsertCompanyRepository,
    upsertEstablishmentRepository: UpsertEstablishmentRepository,
    upsertSimplesRepositoryStub: UpsertSimplesRepository,
    cnpjRawDataParser: CnpjRawDataParser,
  ) {
    this.listDataUrlRepository = listDataUrlRepository;
    this.zipLoader = zipLoader;
    this.upsertCompanyRepository = upsertCompanyRepository;
    this.upsertEstablishmentRepository = upsertEstablishmentRepository;
    this.upsertSimplesRepository = upsertSimplesRepositoryStub;
    this.cnpjRawDataParser = cnpjRawDataParser;
  }

  async query(): Promise<void> {
    const dataUrls = await this.listDataUrlRepository.list();

    await Promise.all(dataUrls.map((dataUrl) => this.loadDataUrl(dataUrl)));
  }

  private async loadDataUrl(dataUrl: DataUrlModel) {
    const stream = await this.zipLoader.read(dataUrl.url);

    stream.on('data', (data) => {
      const parsedData = this.cnpjRawDataParser.parse(data, dataUrl.type);
      const upsert = this.getUpsert(dataUrl.type);

      upsert(parsedData);
    });

    stream.on('error', () => {});
  }

  private getUpsert(dataType: DataUrlType) {
    const upsert = {
      COMPANY: this.upsertCompanyRepository.upsert,
      ESTABLISHMENT: this.upsertEstablishmentRepository.upsert,
      SIMPLES: this.upsertSimplesRepository.upsert,
    } as { [key in DataUrlType]: (data: Object) => Promise<void> };

    return upsert[dataType];
  }
}
