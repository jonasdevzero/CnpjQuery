import { UpsertQualificationModel } from '@domain/models';
import { dbMock } from '@infra/db/postgres/connection.mock';
import { UpsertQualificationPostgresRepository } from './UpsertQualificationPostgresRepository';

const makeFakeQualification = (): UpsertQualificationModel => {
  const qualification = {
    code: 'any_code',
    description: 'any_description',
  };
  return qualification;
};

describe('UpsertQualificationPostgresRepository', () => {
  test('Should not throw if postgres throws ', async () => {
    const sut = new UpsertQualificationPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeQualification())).rejects.toThrow();
  });
});
