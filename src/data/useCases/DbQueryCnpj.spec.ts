import { DataUrlModel } from '../../domain/models/DataUrl';
import { ListDataUrlRepository } from '../protocols/ListDataUrlRepository';
import { DbQueryCnpj } from './DbQueryCnpj';

describe('DbQueryCnpj UseCase', () => {
  test('Should throw if ListDataUrlRepository throws', async () => {
    class ListDataUrlRepositoryStub implements ListDataUrlRepository {
      list(): Promise<DataUrlModel[]> {
        throw new Error();
      }
    }

    const listDataUrlRepositoryStub = new ListDataUrlRepositoryStub();

    const sut = new DbQueryCnpj(listDataUrlRepositoryStub);

    await expect(sut.query()).rejects.toThrow();
  });
});
