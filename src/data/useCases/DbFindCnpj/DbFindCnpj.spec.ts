import { DbFindCnpj } from './DbFindCnpj';
import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpjRepository } from '../../protocols/FindCnpjRepository';

describe('DbFindCnpj', () => {
  test('Should throw if FindCnpjRepository throws', async () => {
    class FindCnpjRepositoryStub implements FindCnpjRepository {
      async find(cnpj: string): Promise<CnpjModel | null> {
        throw new Error();
      }
    }

    const findCnpjRepositoryStub = new FindCnpjRepositoryStub();

    const sut = new DbFindCnpj(findCnpjRepositoryStub);

    await expect(sut.find('any_cnpj')).rejects.toThrow();
  });
});
