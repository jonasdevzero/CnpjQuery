import { dbMock } from '../../dbMock';
import { ListDataUrlPostgresRepository } from './ListDataUrlPostgresRepository';

const makeSut = (): ListDataUrlPostgresRepository => {
  return new ListDataUrlPostgresRepository();
};

describe('ListDataUrlPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.list()).rejects.toThrow();
  });

  test('Should return correct values on success', async () => {
    const sut = makeSut();

    const dataUrlList = [{ id: 'any_id', url: 'any_url', type: 'any_type' }];

    dbMock.mockImplementationOnce(() => {
      return dataUrlList;
    });

    const result = await sut.list();

    expect(result).toEqual(dataUrlList);
  });
});
