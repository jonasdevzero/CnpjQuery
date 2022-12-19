import { DbFindCnpj } from './DbFindCnpj';
import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpjRepository } from '../../protocols/FindCnpjRepository';

const makeFakeFindCnpjRepository = (): FindCnpjRepository => {
  class FindCnpjRepositoryStub implements FindCnpjRepository {
    async find(cnpj: string): Promise<CnpjModel | null> {
      throw new Error();
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
    const { sut } = makeSut();

    await expect(sut.find('any_cnpj')).rejects.toThrow();
  });
});
