import { dbMock } from '../../dbMock';
import { FindCnpjPostgresRepository } from './FindCnpjPostgresRepository';

describe('FindCnpjPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = new FindCnpjPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.find('any_cnpj')).rejects.toThrow();
  });
});
