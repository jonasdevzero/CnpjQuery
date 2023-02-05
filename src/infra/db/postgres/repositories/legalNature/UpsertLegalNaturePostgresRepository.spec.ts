import { UpsertQualificationModel } from '@domain/models';
import { dbMock } from '../../dbMock';
import { UpsertLegalNaturePostgresRepository } from './UpsertLegalNaturePostgresRepository';

const makeFakeQualification = (): UpsertQualificationModel => {
  const qualification = {
    code: 'any_code',
    description: 'any_description',
  };
  return qualification;
};

describe('UpsertLegalNaturePostgresRepository', () => {
  test('Should not throw if postgres throws ', async () => {
    const sut = new UpsertLegalNaturePostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeQualification())).rejects.toThrow();
  });
});
