import {
  QueryCnpj,
  ListDataUrlRepository,
  DataUrlModel,
  DataUrlType,
  UpsertCompanyRepository,
  UpsertEstablishmentRepository,
  UpsertSimplesRepository,
  CnpjRawDataParser,
  UpsertPartnerRepository,
  UpsertCountryRepository,
  UpsertCityRepository,
  UpsertQualificationRepository,
  UpsertLegalNatureRepository,
  UpsertCnaeRepository,
  UpsertReasonRepository,
  CnpjDataReader,
} from './DbQueryCnpj.protocols';

export class DbQueryCnpj implements QueryCnpj {
  private readonly listDataUrlRepository: ListDataUrlRepository;
  private readonly cnpjDataReader: CnpjDataReader;
  private readonly cnpjRawDataParser: CnpjRawDataParser;
  private readonly upsertCompanyRepository: UpsertCompanyRepository;
  private readonly upsertEstablishmentRepository: UpsertEstablishmentRepository;
  private readonly upsertSimplesRepository: UpsertSimplesRepository;
  private readonly upsertPartnerRepository: UpsertPartnerRepository;
  private readonly upsertCountryRepository: UpsertCountryRepository;
  private readonly upsertCityRepository: UpsertCityRepository;
  private readonly upsertQualificationRepository: UpsertQualificationRepository;
  private readonly upsertLegalNatureRepository: UpsertLegalNatureRepository;
  private readonly upsertCnaeRepository: UpsertCnaeRepository;
  private readonly upsertReasonRepository: UpsertReasonRepository;

  constructor(
    listDataUrlRepository: ListDataUrlRepository,
    cnpjDataReader: CnpjDataReader,
    upsertCompanyRepository: UpsertCompanyRepository,
    upsertEstablishmentRepository: UpsertEstablishmentRepository,
    upsertSimplesRepositoryStub: UpsertSimplesRepository,
    cnpjRawDataParser: CnpjRawDataParser,
    upsertPartnerRepository: UpsertPartnerRepository,
    upsertCountryRepository: UpsertCountryRepository,
    upsertCityRepository: UpsertCityRepository,
    upsertQualificationRepository: UpsertQualificationRepository,
    upsertLegalNatureRepository: UpsertLegalNatureRepository,
    upsertCnaeRepository: UpsertCnaeRepository,
    upsertReasonRepository: UpsertReasonRepository,
  ) {
    this.listDataUrlRepository = listDataUrlRepository;
    this.cnpjDataReader = cnpjDataReader;
    this.upsertCompanyRepository = upsertCompanyRepository;
    this.upsertEstablishmentRepository = upsertEstablishmentRepository;
    this.upsertSimplesRepository = upsertSimplesRepositoryStub;
    this.cnpjRawDataParser = cnpjRawDataParser;
    this.upsertPartnerRepository = upsertPartnerRepository;
    this.upsertCountryRepository = upsertCountryRepository;
    this.upsertCityRepository = upsertCityRepository;
    this.upsertQualificationRepository = upsertQualificationRepository;
    this.upsertLegalNatureRepository = upsertLegalNatureRepository;
    this.upsertCnaeRepository = upsertCnaeRepository;
    this.upsertReasonRepository = upsertReasonRepository;
  }

  async query(): Promise<void> {
    const dataUrls = await this.listDataUrlRepository.list();
    this.execute(dataUrls);
  }

  private async execute(dataUrls: DataUrlModel[]) {
    try {
      for (const dataUrl of dataUrls) {
        await this.queryDataUrl(dataUrl);
      }
    } catch (error) {
      // TODO: add error log
    }
  }

  private async queryDataUrl(dataUrl: DataUrlModel) {
    const { url, type } = dataUrl;

    const event = await this.cnpjDataReader.read(url);
    const upsert = this.getUpsert(type);

    return new Promise<void>(async (resolve, reject) => {
      event.on('rows', async (data) => {
        const parsedData = data.map((row) => this.cnpjRawDataParser.parse(row, type));
        await Promise.all(parsedData.map(upsert));

        event.emit('rows:next');
      });

      event.on('error', (error) => reject(error));
      event.on('end', () => resolve());
    });
  }

  private getUpsert(dataType: DataUrlType) {
    const upsert = {
      COMPANY: this.upsertCompanyRepository.upsert,
      ESTABLISHMENT: this.upsertEstablishmentRepository.upsert.bind(
        this.upsertEstablishmentRepository,
      ),
      SIMPLES: this.upsertSimplesRepository.upsert,
      PARTNER: this.upsertPartnerRepository.upsert.bind(this.upsertPartnerRepository),
      COUNTRIES: this.upsertCountryRepository.upsert,
      CITIES: this.upsertCityRepository.upsert,
      QUALIFICATIONS: this.upsertQualificationRepository.upsert,
      NATURES: this.upsertLegalNatureRepository.upsert,
      CNAE: this.upsertCnaeRepository.upsert,
      REASONS: this.upsertReasonRepository.upsert,
    } as { [key in DataUrlType]: (data: Object) => Promise<void> };

    return upsert[dataType];
  }
}
