import { UpsertSimplesPostgresRepository } from './UpsertSimplesPostgresRepository';
import { dbMock } from '../../dbMock';
import { UpsertSimplesModel } from '../../../../../domain/models/Simples';

const makeFakeSimples = (): UpsertSimplesModel => {
  const simplesData = {
    baseCnpj: 'any_base_cnpj',
    identification: false,
    identificationDate: 'any_date',
    exclusionDate: 'any_data',
    meiIdentification: false,
    meiIdentificationDate: 'any_date',
    meiExclusionDate: 'any_date',
  };
  return simplesData;
};

describe('UpsertSimplesPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = new UpsertSimplesPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeSimples())).rejects.toThrow();
  });
});
