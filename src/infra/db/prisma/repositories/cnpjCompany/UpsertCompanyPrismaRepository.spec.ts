import { UpsertCompanyModel } from '../../../../../domain/models/Company';
import { prismaMock } from '../../clientMock';
import { UpsertCompanyPrismaRepository } from './UpsertCompanyPrismaRepository';

const makeFakeCompanyData = (): UpsertCompanyModel => {
  return {
    baseCnpj: 'any_base_cnpj',
    corporateName: 'any_corporate_name',
    legalNature: 'any_legal_nature',
    qualification: 'any_qualification',
    capital: 'any_capital',
    size: 'any_size',
    federativeEntity: 'any_federative_entity',
  };
};

const makeSut = (): UpsertCompanyPrismaRepository => {
  return new UpsertCompanyPrismaRepository();
};

describe('UpsertCompanyPrismaRepository', () => {
  test('Should call prisma upsert with correct values', async () => {
    const sut = makeSut();

    const companyData = makeFakeCompanyData();

    await sut.upsert(companyData);

    expect(prismaMock.cnpj.upsert).toHaveBeenCalledWith({
      where: { baseCnpj: 'any_base_cnpj' },
      update: { baseCnpj: 'any_base_cnpj' },
      create: { baseCnpj: 'any_base_cnpj' },
    });
    expect(prismaMock.cnpjCompany.upsert).toHaveBeenCalledWith({
      where: { baseCnpj: 'any_base_cnpj' },
      create: companyData,
      update: companyData,
    });
  });

  test('Should throw if prisma upsert throws', async () => {
    const sut = makeSut();

    prismaMock.cnpjCompany.upsert.mockImplementationOnce(() => {
      throw new Error('any_error');
    });

    await expect(sut.upsert(makeFakeCompanyData())).rejects.toThrow(new Error('any_error'));
  });
});
