import { UpsertCompanyModel } from '../../../../../domain/models/Company';
import { dbMock } from '../../dbMock';
import { UpsertCompanyPostgresRepository } from './UpsertCompanyPostgresRepository';

const makeFakeCompanyData = (): UpsertCompanyModel => {
  const companyData = {
    baseCnpj: 'any_base_cnpj',
    corporateName: 'any_corporate_name',
    legalNature: 'any_legal_nature',
    qualification: 'any_qualification',
    capital: 'any_capital',
    size: 'any_size',
    federativeEntity: 'any_federative_entity',
  };
  return companyData;
};

const makeSut = (): UpsertCompanyPostgresRepository => {
  return new UpsertCompanyPostgresRepository();
};

describe('UpsertCompanyPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeCompanyData())).rejects.toThrow();
  });
});
