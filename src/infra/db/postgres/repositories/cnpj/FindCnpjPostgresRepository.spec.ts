import { dbMock } from '../../dbMock';
import { FindCnpjPostgresRepository } from './FindCnpjPostgresRepository';

const makeSut = () => {
  return new FindCnpjPostgresRepository();
};

describe('FindCnpjPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.find('any_cnpj')).rejects.toThrow();
  });

  test('Should return null if cnpj was not found', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => []);

    const cnpj = await sut.find('any_cnpj');

    expect(cnpj).toBeNull();
  });
});
