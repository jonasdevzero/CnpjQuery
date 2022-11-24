import { UpsertCompanyModel } from '../../domain/models/Company';
import { DataUrlModel, DataUrlType } from '../../domain/models/DataUrl';
import { UpsertEstablishmentModel } from '../../domain/models/Establishment';
import { QueryCnpj } from '../../domain/useCases/QueryCnpj';
import { ZipLoader } from '../../presentation/protocols/ZipLoader';
import { ListDataUrlRepository } from '../protocols/ListDataUrlRepository';
import { UpsertCompanyRepository } from '../protocols/UpsertCompanyRepository';
import { UpsertEstablishmentRepository } from '../protocols/UpsertEstablishmentRepository';

export class DbQueryCnpj implements QueryCnpj {
  private readonly listDataUrlRepository: ListDataUrlRepository;
  private readonly zipLoader: ZipLoader;
  private readonly upsertCompanyRepository: UpsertCompanyRepository;
  private readonly upsertEstablishmentRepository: UpsertEstablishmentRepository;

  constructor(
    listDataUrlRepository: ListDataUrlRepository,
    zipLoader: ZipLoader,
    upsertCompanyRepository: UpsertCompanyRepository,
    upsertEstablishmentRepository: UpsertEstablishmentRepository,
  ) {
    this.listDataUrlRepository = listDataUrlRepository;
    this.zipLoader = zipLoader;
    this.upsertCompanyRepository = upsertCompanyRepository;
    this.upsertEstablishmentRepository = upsertEstablishmentRepository;
  }

  private readonly parsers = {
    COMPANY: this.parseCompanyData,
    ESTABLISHMENT: this.parseEstablishmentData,
  } as {
    [key in DataUrlType]: (data: string[]) => any;
  };

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

      switch (dataUrl.type) {
        case 'COMPANY':
          this.upsertCompanyRepository.upsert(parsedData);
          break;
        case 'ESTABLISHMENT':
          this.upsertEstablishmentRepository.upsert(parsedData);
          break;
      }
    });

    stream.on('error', () => {});
  }

  private parseCompanyData(data: string[]): UpsertCompanyModel {
    const [baseCnpj, corporateName, legalNature, qualification, capital, size, federativeEntity] =
      data;

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

  private parseEstablishmentData(data: string[]): UpsertEstablishmentModel {
    const [
      baseCnpj,
      orderCnpj,
      dvCnpj,
      _identifier,
      corporateName,
      cadasterStatus,
      cadasterStatusDate,
      cadasterStatusReason,
      cityAbroad,
      countryCode,
      activityStartAt,
      mainCnae,
      secondaryCnae,
      streetDescription,
      street,
      number,
      complement,
      district,
      cep,
      uf,
      city,
      ddd1,
      telephone1,
      ddd2,
      telephone2,
      faxDdd,
      fax,
      email,
      specialStatus,
      specialStatusDate,
    ] = data;

    const formattedBaseCnpj = baseCnpj.replace(
      /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
      '$1.$2.$3',
    );
    const cnpj = `${formattedBaseCnpj}/${orderCnpj}-${dvCnpj}`;

    const fullTelephone1 = `(${ddd1}) ${telephone1}`;
    const fullTelephone2 = !!ddd2 && !!telephone2 ? `(${ddd2}) ${telephone2}` : '';
    const fullFax = !!faxDdd && !!fax ? `${faxDdd} ${fax}` : '';

    return {
      baseCnpj,
      cnpj,
      corporateName,
      cadasterStatus,
      cadasterStatusDate,
      cadasterStatusReason,
      activityStartAt,
      mainCnae,
      secondaryCnae,
      specialStatus,
      specialStatusDate,
      telephone1: fullTelephone1,
      telephone2: fullTelephone2,
      fax: fullFax,
      email,

      address: {
        cityAbroad,
        countryCode,
        streetDescription,
        street,
        number,
        complement,
        district,
        cep,
        uf,
        city,
      },
    };
  }
}
