import { UpsertCompanyModel } from '../../domain/models/Company';
import { DataUrlModel } from '../../domain/models/DataUrl';
import {
  ZipLoader,
  ZipLoaderStream,
} from '../../presentation/protocols/ZipLoader';
import { ListDataUrlRepository } from '../protocols/ListDataUrlRepository';
import { UpsertCompanyRepository } from '../protocols/UpsertCompanyRepository';
import { DbQueryCnpj } from './DbQueryCnpj';

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

const makeUpsertCompanyRepository = (): UpsertCompanyRepository => {
  class UpsertCompanyRepositoryStub implements UpsertCompanyRepository {
    async upsert(data: UpsertCompanyModel) {
      // ...
    }
  }

  return new UpsertCompanyRepositoryStub();
};

const makeZipLoader = (): ZipLoader => {
  class ZipLoaderStub implements ZipLoader {
    async load(url: string): Promise<ZipLoaderStream> {
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
  zipLoaderStub: ZipLoader;
  upsertCompanyRepositoryStub: UpsertCompanyRepository;
  sut: DbQueryCnpj;
}

const makeSut = (): SutTypes => {
  const listDataUrlRepositoryStub = makeListDataUrlRepository();
  const zipLoaderStub = makeZipLoader();
  const upsertCompanyRepositoryStub = makeUpsertCompanyRepository();

  const sut = new DbQueryCnpj(
    listDataUrlRepositoryStub,
    zipLoaderStub,
    upsertCompanyRepositoryStub,
  );

  return {
    sut,
    listDataUrlRepositoryStub,
    zipLoaderStub,
    upsertCompanyRepositoryStub,
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
    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'load');

    await sut.query();

    const urls = (await listSpy.mock.results[0].value).map((u) => u.url);

    urls.forEach((_, index) => {
      expect(urls).toContain(zipLoaderSpy.mock.calls[index][0]);
    });
  });

  test('Should handle stream data and error listeners of ZipLoaderStream', async () => {
    const { sut, zipLoaderStub } = makeSut();

    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'load');

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
    } = makeSut();

    jest
      .spyOn(listDataUrlRepositoryStub, 'list')
      .mockImplementationOnce(async () => {
        return [{ id: 'any_id', url: 'http://any_url.zip', type: 'COMPANY' }];
      });

    const zipLoaderSpy = jest.spyOn(zipLoaderStub, 'load');
    const upsertSpy = jest.spyOn(upsertCompanyRepositoryStub, 'upsert');

    await sut.query();

    const zipLoaderResult = await zipLoaderSpy.mock.results[0].value;
    const zipLoaderOnSpy = jest.spyOn(zipLoaderResult, 'on');

    const dataListener = jest.fn(
      zipLoaderOnSpy.mock.calls[0][1] as (data: string) => {},
    );

    dataListener(
      '"any_base_cnpj";"any_corporate_name";"any_legal_nature";"any_qualification";"any_capital";"any_size";"any_federative_entity"',
    );

    expect(upsertSpy).toHaveBeenCalledWith({
      baseCnpj: 'any_base_cnpj',
      corporateName: 'any_corporate_name',
      legalNature: 'any_legal_nature',
      qualification: 'any_qualification',
      capital: 'any_capital',
      size: 'any_size',
      federativeEntity: 'any_federative_entity',
    });
  });
});
