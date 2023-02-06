import { UpsertCnaeModel } from '@domain/models/Cnae';
import { dbMock } from '@infra/db/postgres/connection.mock';
import { UpsertCnaePostgresRepository } from './UpsertCnaePostgresRepository';

const makeFakeCnae = (): UpsertCnaeModel => {
  const qualification = {
    code: 'any_code',
    description: 'any_description',
  };
  return qualification;
};

describe('UpsertCnaePostgresRepository', () => {
  test('Should not throw if postgres throws ', async () => {
    const sut = new UpsertCnaePostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeCnae())).rejects.toThrow();
  });
});
