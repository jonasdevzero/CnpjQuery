import { PostgresError } from 'postgres';
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
  test('Should not throw if postgres throws violates foreign key constraint', async () => {
    const sut = new UpsertSimplesPostgresRepository();

    const errorMessage =
      'insert or update on table "cnpjSimples" violates foreign key constraint "cnpjSimples_baseCnpj_fkey"';

    dbMock.mockImplementationOnce(() => {
      throw new PostgresError(errorMessage);
    });

    await sut.upsert(makeFakeSimples());
  });
});
