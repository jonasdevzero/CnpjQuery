import { DataUrlType } from '../../domain/models/DataUrl';
import { DbQueryCnpj } from './DbQueryCnpj';
import {
  ListDataUrlRepository,
  DataUrlModel,
  ZipReader,
  ZipReaderStream,
  UpsertCompanyRepository,
  UpsertEstablishmentRepository,
  UpsertSimplesRepository,
  UpsertCompanyModel,
  UpsertEstablishmentModel,
  UpsertSimplesModel,
  CnpjRawDataParser,
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
    type: 'GENERAL',
  },
  {
    id: 'any_id_4',
    url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
    type: 'SIMPLES',
  },
  {
    id: 'any_id_5',
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

const makeZipLoader = (): ZipReader => {
  class ZipLoaderStub implements ZipReader {
    async read(url: string): Promise<ZipReaderStream> {
      return {
        on: jest.fn(),
      };
    }
  }

  return new ZipLoaderStub();
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
  zipLoaderStub: ZipReader;
  upsertCompanyRepositoryStub: UpsertCompanyRepository;
  upsertEstablishmentRepositoryStub: UpsertEstablishmentRepository;
  upsertSimplesRepositoryStub: UpsertSimplesRepository;
  cnpjRawDataParser: CnpjRawDataParser;
  sut: DbQueryCnpj;
}

const makeSut = (): SutTypes => {
  const listDataUrlRepositoryStub = makeListDataUrlRepository();
  const zipLoaderStub = makeZipLoader();
  const upsertCompanyRepositoryStub = makeUpsertCompanyRepository();
  const upsertEstablishmentRepositoryStub = makeUpsertEstablishmentRepository();
  const upsertSimplesRepositoryStub = makeUpsertSimplesRepository();
  const cnpjRawDataParser = makeCnpjRawDataParser();

  const sut = new DbQueryCnpj(
    listDataUrlRepositoryStub,
    zipLoaderStub,
    upsertCompanyRepositoryStub,
    upsertEstablishmentRepositoryStub,
    upsertSimplesRepositoryStub,
    cnpjRawDataParser,
  );

  return {
    sut,
    listDataUrlRepositoryStub,
    zipLoaderStub,
    upsertCompanyRepositoryStub,
    upsertEstablishmentRepositoryStub,
    upsertSimplesRepositoryStub,
    cnpjRawDataParser,
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

  test('Should call ZipLoader with correct value', async () => {
    const { sut, listDataUrlRepositoryStub, zipLoaderStub } = makeSut();

    const listSpy = jest.spyOn(listDataUrlRepositoryStub, 'list');
    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'read');

    await sut.query();

    const urls = (await listSpy.mock.results[0].value).map((u) => u.url);

    urls.forEach((_, index) => {
      expect(urls).toContain(zipLoaderSpy.mock.calls[index][0]);
    });
  });

  test('Should handle stream data and error listeners of ZipLoaderStream', async () => {
    const { sut, zipLoaderStub } = makeSut();

    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'read');

    await sut.query();

    const zipLoaderResult = await zipLoaderSpy.mock.results[0].value;
    const zipLoaderOnSpy = jest.spyOn(zipLoaderResult, 'on');

    const [dataEvent, dataListener] = zipLoaderOnSpy.mock.calls[0];
    const [errorEvent, errorListener] = zipLoaderOnSpy.mock.calls[1];

    expect(dataEvent).toBe('data');
    expect(errorEvent).toBe('error');
    expect(typeof dataListener).toBe('function');
    expect(typeof errorListener).toBe('function');
  });

  test('Should call UpsertCompanyRepository with correct values', async () => {
    const {
      sut,
      listDataUrlRepositoryStub,
      zipLoaderStub,
      upsertCompanyRepositoryStub,
      cnpjRawDataParser,
    } = makeSut();

    jest.spyOn(listDataUrlRepositoryStub, 'list').mockImplementationOnce(async () => {
      return [{ id: 'any_id', url: 'http://any_url.zip', type: 'COMPANY' }];
    });

    const companyData = {
      baseCnpj: 'any_base_cnpj',
      corporateName: 'any_corporate_name',
      legalNature: 'any_legal_nature',
      qualification: 'any_qualification',
      capital: 'any_capital',
      size: 'any_size',
      federativeEntity: 'any_federative_entity',
    };

    jest.spyOn(cnpjRawDataParser, 'parse').mockImplementationOnce(() => {
      return companyData;
    });

    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'read');
    const upsertSpy = jest.spyOn(upsertCompanyRepositoryStub, 'upsert');

    await sut.query();

    const zipLoaderResult = await zipLoaderSpy.mock.results[0].value;
    const zipLoaderOnSpy = jest.spyOn(zipLoaderResult, 'on');

    const dataListener = jest.fn(zipLoaderOnSpy.mock.calls[0][1] as (data: string) => {});
    dataListener('any_data');

    expect(upsertSpy).toHaveBeenCalledWith(companyData);

    upsertSpy.mockClear();
  });

  test('Should call UpsertEstablishmentRepository with correct values', async () => {
    const {
      sut,
      listDataUrlRepositoryStub,
      zipLoaderStub,
      upsertEstablishmentRepositoryStub,
      cnpjRawDataParser,
    } = makeSut();

    jest.spyOn(listDataUrlRepositoryStub, 'list').mockImplementationOnce(async () => {
      return [{ id: 'any_id', url: 'http://any_url.zip', type: 'ESTABLISHMENT' }];
    });

    const establishmentData = {
      baseCnpj: '00000000',
      cnpj: '00.000.000/0001-00',
      corporateName: 'any_corporate_name',
      cadasterStatus: 'any_cadaster_status',
      cadasterStatusDate: 'any_cadaster_status_date',
      cadasterStatusReason: '00',

      activityStartAt: '20170919',

      mainCnae: '4729699',
      secondaryCnae: '',

      specialStatus: '',
      specialStatusDate: '',

      telephone1: '(19) 89501000',
      telephone2: '(19) 89501001',
      fax: '19 89501002',
      email: 'any_mail@mail.com',

      address: {
        cityAbroad: '',
        countryCode: '',
        streetDescription: 'AVENIDA',
        street: 'LEONARDO ANTONIO SCHIAVINATTO',
        number: '35',
        complement: '',
        district: 'JARDIM PARAISO I (NOVA VENEZA)',
        cep: '13179335',
        uf: 'SP',
        city: '7149',
      },
    };

    jest.spyOn(cnpjRawDataParser, 'parse').mockImplementationOnce(() => {
      return establishmentData;
    });

    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'read');
    const upsertSpy = jest.spyOn(upsertEstablishmentRepositoryStub, 'upsert');

    await sut.query();

    const zipLoaderResult = await zipLoaderSpy.mock.results[0].value;
    const zipLoaderOnSpy = jest.spyOn(zipLoaderResult, 'on');

    const dataListener = jest.fn(zipLoaderOnSpy.mock.calls[0][1] as (data: string) => {});

    dataListener('any_data');

    expect(upsertSpy).toHaveBeenCalledWith(establishmentData);
  });

  test('Should call UpsertSimplesRepository with correct values', async () => {
    const {
      sut,
      listDataUrlRepositoryStub,
      zipLoaderStub,
      upsertSimplesRepositoryStub,
      cnpjRawDataParser,
    } = makeSut();

    jest.spyOn(listDataUrlRepositoryStub, 'list').mockImplementationOnce(async () => {
      return [{ id: 'any_id', url: 'http://any_url.zip', type: 'SIMPLES' }];
    });

    const simplesData = {
      baseCnpj: '00000000',

      identification: false,
      identificationDate: '20070701',
      exclusionDate: '20070701',

      meiIdentification: false,
      meiIdentificationDate: '20090701',
      meiExclusionDate: '20090701',
    };

    jest.spyOn(cnpjRawDataParser, 'parse').mockImplementationOnce(() => {
      return simplesData;
    });

    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'read');
    const upsertSpy = jest.spyOn(upsertSimplesRepositoryStub, 'upsert');

    await sut.query();

    const zipLoaderResult = await zipLoaderSpy.mock.results[0].value;
    const zipLoaderOnSpy = jest.spyOn(zipLoaderResult, 'on');

    const dataListener = jest.fn(zipLoaderOnSpy.mock.calls[0][1] as (data: string) => {});

    dataListener('any_data');

    expect(upsertSpy).toHaveBeenCalledWith(simplesData);
  });
});
