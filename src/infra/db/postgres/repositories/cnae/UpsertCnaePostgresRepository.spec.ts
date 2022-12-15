import { dbMock } from '../../dbMock';
import { UpsertCnaePostgresRepository } from './UpsertCnaePostgresRepository';
import { UpsertCnaeModel } from '../../../../../domain/models/Cnae';

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
