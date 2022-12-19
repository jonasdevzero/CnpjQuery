import { DbFindCnpj } from './DbFindCnpj';
import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpjRepository } from '../../protocols/FindCnpjRepository';

const makeFakeFindCnpjRepository = (): FindCnpjRepository => {
  class FindCnpjRepositoryStub implements FindCnpjRepository {
    async find(cnpj: string): Promise<CnpjModel | null> {
      return {} as CnpjModel;
    }
  }

  return new FindCnpjRepositoryStub();
};

interface SutTypes {
  sut: DbFindCnpj;
  findCnpjRepositoryStub: FindCnpjRepository;
}

const makeSut = (): SutTypes => {
  const findCnpjRepositoryStub = makeFakeFindCnpjRepository();
  const sut = new DbFindCnpj(findCnpjRepositoryStub);

  return { sut, findCnpjRepositoryStub };
};

describe('DbFindCnpj', () => {
  test('Should throw if FindCnpjRepository throws', async () => {
    const { sut, findCnpjRepositoryStub } = makeSut();

    jest.spyOn(findCnpjRepositoryStub, 'find').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.find('any_cnpj')).rejects.toThrow();
  });

  test('Should return correct value if success', async () => {
    const { sut } = makeSut();

    const result = await sut.find('any_cnpj');

    expect(result).toEqual({});
  });
});