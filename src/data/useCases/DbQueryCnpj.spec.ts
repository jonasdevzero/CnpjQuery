import { DataUrlModel } from '../../domain/models/DataUrl';
import {
  ZipLoader,
  ZipLoaderStream,
} from '../../presentation/protocols/ZipLoader';
import { ListDataUrlRepository } from '../protocols/ListDataUrlRepository';
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
  sut: DbQueryCnpj;
}

const makeSut = (): SutTypes => {
  const listDataUrlRepositoryStub = makeListDataUrlRepository();
  const zipLoaderStub = makeZipLoader();

  const sut = new DbQueryCnpj(listDataUrlRepositoryStub, zipLoaderStub);

  return {
    sut,
    listDataUrlRepositoryStub,
    zipLoaderStub,
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
});
