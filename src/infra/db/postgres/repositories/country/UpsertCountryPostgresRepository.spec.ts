import { UpsertCountryModel } from '@domain/models';
import { dbMock } from '@infra/db/postgres/connection.mock';
import { UpsertCountryPostgresRepository } from './UpsertCountryPostgresRepository';

const makeFakeCountry = (): UpsertCountryModel => {
  const country = {
    code: 'any_code',
    name: 'any_name',
  };
  return country;
};

describe('UpsertCountryPostgresRepository', () => {
  test('Should not throw if postgres throws ', async () => {
    const sut = new UpsertCountryPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeCountry())).rejects.toThrow();
  });
});
