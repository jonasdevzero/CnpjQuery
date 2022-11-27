import { dbMock } from '../../dbMock';
import { ListDataUrlPostgresRepository } from './ListDataUrlPostgresRepository';

describe('ListDataUrlPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = new ListDataUrlPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.list()).rejects.toThrow();
  });
});
