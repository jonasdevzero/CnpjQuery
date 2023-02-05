import { UpsertReasonModel } from '@domain/models';
import { dbMock } from '../../dbMock';
import { UpsertReasonPostgresRepository } from './UpsertReasonPostgresRepository';

const makeFakeReason = (): UpsertReasonModel => {
  const reason = {
    code: 'any_code',
    description: 'any_description',
  };
  return reason;
};

describe('UpsertReasonPostgresRepository', () => {
  test('Should not throw if postgres throws ', async () => {
    const sut = new UpsertReasonPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeReason())).rejects.toThrow();
  });
});
