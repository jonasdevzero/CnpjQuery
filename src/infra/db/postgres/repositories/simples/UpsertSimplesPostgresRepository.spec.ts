import { PostgresError } from 'postgres';
import { UpsertSimplesModel } from '@domain/models';
import { UpsertSimplesPostgresRepository } from './UpsertSimplesPostgresRepository';
import { dbMock } from '../../dbMock';

const makeFakeSimples = (): UpsertSimplesModel => {
  const simplesData = {
    baseCnpj: '00000000',
    isSimples: false,
    simplesSince: 'any_date',
    simplesExclusionDate: 'any_data',
    isMei: false,
    meiSince: 'any_date',
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
