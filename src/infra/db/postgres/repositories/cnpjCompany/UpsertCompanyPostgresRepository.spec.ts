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

  test('Should call select with correct value', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return [];
    });

    const companyData = makeFakeCompanyData();

    await sut.upsert(companyData);

    expect(dbMock.mock.calls[0][1]).toBe(companyData.baseCnpj);
  });

  test('Should insert data if company was not found', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return [];
    });

    await sut.upsert(makeFakeCompanyData());

    const query = dbMock.mock.calls[1][0].join('').trim();

    expect(query).toMatch(/^[INSERT INTO].+/g);
  });

  test('Should update data if company was found', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return ['any_company'];
    });

    await sut.upsert(makeFakeCompanyData());

    const query = dbMock.mock.calls[1][0].join('').trim();

    expect(query).toMatch(/^[UPDATE].+/g);
  });
});
