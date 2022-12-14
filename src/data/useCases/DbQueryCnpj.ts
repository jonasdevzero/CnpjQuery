import {
  QueryCnpj,
  ListDataUrlRepository,
  DataUrlModel,
  DataUrlType,
  ZippedCsvReader,
  UpsertCompanyRepository,
  UpsertEstablishmentRepository,
  UpsertSimplesRepository,
  CnpjRawDataParser,
} from './DbQueryCnpj.protocols';

export class DbQueryCnpj implements QueryCnpj {
  private readonly listDataUrlRepository: ListDataUrlRepository;
  private readonly zippedCsvReader: ZippedCsvReader;
  private readonly upsertCompanyRepository: UpsertCompanyRepository;
  private readonly upsertEstablishmentRepository: UpsertEstablishmentRepository;
  private readonly upsertSimplesRepository: UpsertSimplesRepository;
  private readonly cnpjRawDataParser: CnpjRawDataParser;

  constructor(
    listDataUrlRepository: ListDataUrlRepository,
    zipLoader: ZippedCsvReader,
    upsertCompanyRepository: UpsertCompanyRepository,
    upsertEstablishmentRepository: UpsertEstablishmentRepository,
    upsertSimplesRepositoryStub: UpsertSimplesRepository,
    cnpjRawDataParser: CnpjRawDataParser,
  ) {
    this.listDataUrlRepository = listDataUrlRepository;
    this.zippedCsvReader = zipLoader;
    this.upsertCompanyRepository = upsertCompanyRepository;
    this.upsertEstablishmentRepository = upsertEstablishmentRepository;
    this.upsertSimplesRepository = upsertSimplesRepositoryStub;
    this.cnpjRawDataParser = cnpjRawDataParser;
  }

  async query(): Promise<void> {
    const dataUrls = await this.listDataUrlRepository.list();
    await this.execute(dataUrls);
  }

  private async execute(dataUrls: DataUrlModel[]) {
    for (const dataUrl of dataUrls) {
      await this.loadDataUrl(dataUrl);
    }
  }

  private async loadDataUrl(dataUrl: DataUrlModel) {
    const event = await this.zippedCsvReader.read(dataUrl.url);
    const upsert = this.getUpsert(dataUrl.type);

    event.on('rows', (data) => {
      const parsedData = data.map((d) => this.cnpjRawDataParser.parse(d, dataUrl.type));
      parsedData.map((d) => upsert(d));
    });

    event.on('error', () => {});
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
