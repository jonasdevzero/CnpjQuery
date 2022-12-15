import { dbMock } from '../../dbMock';
import { UpsertReasonPostgresRepository } from './UpsertReasonPostgresRepository';
import { UpsertReasonModel } from '../../../../../domain/models/Reason';

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
