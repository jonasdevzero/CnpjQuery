import { DbQueryCnpj } from './DbQueryCnpj';
import {
  DataUrlType,
  UpsertPartnerModel,
  ListDataUrlRepository,
  DataUrlModel,
  ZippedCsvReader,
  ZippedCsvReaderEvent,
  UpsertCompanyRepository,
  UpsertEstablishmentRepository,
  UpsertSimplesRepository,
  UpsertCompanyModel,
  UpsertEstablishmentModel,
  UpsertSimplesModel,
  CnpjRawDataParser,
  UpsertPartnerRepository,
  UpsertCountryRepository,
  UpsertCountryModel,
  UpsertCityRepository,
  UpsertCityModel,
  UpsertQualificationRepository,
  UpsertQualificationModel,
  UpsertLegalNatureRepository,
  UpsertLegalNatureModel,
  UpsertCnaeRepository,
  UpsertCnaeModel,
} from './DbQueryCnpj.protocols';

const makeFakeDataUrls = (): DataUrlModel[] => [
  {
    id: 'any_id_1',
    url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
    type: 'COMPANY',
  },
  {
    id: 'any_id_2',
    url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
    type: 'ESTABLISHMENT',
  },
  {
    id: 'any_id_3',
    url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
    type: 'SIMPLES',
  },
  {
    id: 'any_id_4',
    url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
    type: 'PARTNER',
  },
];

const makeCnpjRawDataParser = (): CnpjRawDataParser => {
  class CnpjRawDataParserStub implements CnpjRawDataParser {
    parse(data: string, dataType: DataUrlType): Object {
      return {};
    }
  }

  return new CnpjRawDataParserStub();
};

const makeUpsertSimplesRepository = (): UpsertSimplesRepository => {
  class UpsertSimplesRepositoryStub implements UpsertSimplesRepository {
    async upsert(data: UpsertSimplesModel) {
      // ...
    }
  }

  return new UpsertSimplesRepositoryStub();
};

const makeUpsertEstablishmentRepository = (): UpsertEstablishmentRepository => {
  class UpsertEstablishmentRepositoryStub implements UpsertEstablishmentRepository {
    async upsert(data: UpsertEstablishmentModel) {
      // ...
    }
  }

  return new UpsertEstablishmentRepositoryStub();
};

const makeUpsertCompanyRepository = (): UpsertCompanyRepository => {
  class UpsertCompanyRepositoryStub implements UpsertCompanyRepository {
    async upsert(data: UpsertCompanyModel) {
      // ...
    }
  }

  return new UpsertCompanyRepositoryStub();
};

const makeUpsertPartnerRepository = (): UpsertPartnerRepository => {
  class UpsertPartnerRepositoryStub implements UpsertPartnerRepository {
    async upsert(data: UpsertPartnerModel) {
      // ...
    }
  }

  return new UpsertPartnerRepositoryStub();
};

const makeUpsertCountryRepository = (): UpsertCountryRepository => {
  class UpsertPartnerRepositoryStub implements UpsertCountryRepository {
    async upsert(data: UpsertCountryModel) {
      // ...
    }
  }

  return new UpsertPartnerRepositoryStub();
};

const makeUpsertCityRepository = (): UpsertCityRepository => {
  class UpsertCityRepositoryStub implements UpsertCityRepository {
    async upsert(data: UpsertCityModel) {
      // ...
    }
  }

  return new UpsertCityRepositoryStub();
};

const makeUpsertQualificationRepository = (): UpsertQualificationRepository => {
  class UpsertQualificationRepositoryStub implements UpsertQualificationRepository {
    async upsert(data: UpsertQualificationModel) {
      // ...
    }
  }

  return new UpsertQualificationRepositoryStub();
};

const makeUpsertLegalNatureRepository = (): UpsertLegalNatureRepository => {
  class UpsertLegalNatureRepositoryStub implements UpsertLegalNatureRepository {
    async upsert(data: UpsertLegalNatureModel) {
      // ...
    }
  }

  return new UpsertLegalNatureRepositoryStub();
};

const makeUpsertCnaeRepository = (): UpsertCnaeRepository => {
  class UpsertCnaeRepositoryStub implements UpsertCnaeRepository {
    async upsert(data: UpsertCnaeModel) {
      // ...
    }
  }

  return new UpsertCnaeRepositoryStub();
};

const makeZippedCsvReader = (): ZippedCsvReader => {
  class ZippedCsvReaderStub implements ZippedCsvReader {
    async read(url: string): Promise<ZippedCsvReaderEvent> {
      return {
        on: jest.fn(),
        emit: jest.fn(),
      };
    }
  }

  return new ZippedCsvReaderStub();
};

const makeListDataUrlRepository = (): ListDataUrlRepository => {
  class ListDataUrlRepositoryStub implements ListDataUrlRepository {
    async list(): Promise<DataUrlModel[]> {
      return makeFakeDataUrls();
    }
  }

  return new ListDataUrlRepositoryStub();
};

interface SutTypes {
  listDataUrlRepositoryStub: ListDataUrlRepository;
  zippedCsvReaderStub: ZippedCsvReader;
  upsertCompanyRepositoryStub: UpsertCompanyRepository;
  upsertEstablishmentRepositoryStub: UpsertEstablishmentRepository;
  upsertSimplesRepositoryStub: UpsertSimplesRepository;
  upsertPartnerRepositoryStub: UpsertPartnerRepository;
  upsertCountryRepositoryStub: UpsertCountryRepository;
  upsertCityRepositoryStub: UpsertCityRepository;
  upsertQualificationRepositoryStub: UpsertQualificationRepository;
  upsertLegalNatureRepositoryStub: UpsertLegalNatureRepository;
  upsertCnaeRepositoryStub: UpsertCnaeRepository;
  cnpjRawDataParser: CnpjRawDataParser;
  sut: DbQueryCnpj;
}

const makeSut = (): SutTypes => {
  const listDataUrlRepositoryStub = makeListDataUrlRepository();
  const zippedCsvReaderStub = makeZippedCsvReader();
  const upsertCompanyRepositoryStub = makeUpsertCompanyRepository();
  const upsertEstablishmentRepositoryStub = makeUpsertEstablishmentRepository();
  const upsertSimplesRepositoryStub = makeUpsertSimplesRepository();
  const upsertPartnerRepositoryStub = makeUpsertPartnerRepository();
  const upsertCountryRepositoryStub = makeUpsertCountryRepository();
  const upsertCityRepositoryStub = makeUpsertCityRepository();
  const upsertQualificationRepositoryStub = makeUpsertQualificationRepository();
  const upsertLegalNatureRepositoryStub = makeUpsertLegalNatureRepository();
  const upsertCnaeRepositoryStub = makeUpsertCnaeRepository();
  const cnpjRawDataParser = makeCnpjRawDataParser();

  const sut = new DbQueryCnpj(
    listDataUrlRepositoryStub,
    zippedCsvReaderStub,
    upsertCompanyRepositoryStub,
    upsertEstablishmentRepositoryStub,
    upsertSimplesRepositoryStub,
    cnpjRawDataParser,
    upsertPartnerRepositoryStub,
    upsertCountryRepositoryStub,
    upsertCityRepositoryStub,
    upsertQualificationRepositoryStub,
    upsertLegalNatureRepositoryStub,
    upsertCnaeRepositoryStub,
  );

  return {
    sut,
    listDataUrlRepositoryStub,
    zippedCsvReaderStub,
    upsertCompanyRepositoryStub,
    upsertEstablishmentRepositoryStub,
    upsertSimplesRepositoryStub,
    cnpjRawDataParser,
    upsertPartnerRepositoryStub,
    upsertCountryRepositoryStub,
    upsertCityRepositoryStub,
    upsertQualificationRepositoryStub,
    upsertLegalNatureRepositoryStub,
    upsertCnaeRepositoryStub,
  };
};

describe('DbQueryCnpj UseCase', () => {
  test('Should throw if ListDataUrlRepository throws', async () => {
    const { sut, listDataUrlRepositoryStub } = makeSut();

    jest.spyOn(listDataUrlRepositoryStub, 'list').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.query()).rejects.toThrow();
  });
});
