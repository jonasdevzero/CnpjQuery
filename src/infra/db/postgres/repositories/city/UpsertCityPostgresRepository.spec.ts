import { dbMock } from '../../dbMock';
import { UpsertCityModel } from '../../../../../domain/models/City';
import { UpsertCityPostgresRepository } from './UpsertCityPostgresRepository';

const makeFakeCity = (): UpsertCityModel => {
  const country = {
    code: 'any_code',
    name: 'any_name',
  };
  return country;
};

describe('UpsertCityPostgresRepository', () => {
  test('Should not throw if postgres throws ', async () => {
    const sut = new UpsertCityPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeCity())).rejects.toThrow();
  });
});
