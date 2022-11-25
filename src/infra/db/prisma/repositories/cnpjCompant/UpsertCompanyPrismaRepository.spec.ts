import { prismaMock } from '../../clientMock';
import { UpsertCompanyPrismaRepository } from './UpsertCompanyPrismaRepository';

describe('UpsertCompanyPrismaRepository', () => {
  test('Should call prisma upsert with correct values', async () => {
    const sut = new UpsertCompanyPrismaRepository();

    const companyData = {
      baseCnpj: 'any_base_cnpj',
      corporateName: 'any_corporate_name',
      legalNature: 'any_legal_nature',
      qualification: 'any_qualification',
      capital: '',
      size: 'any_size',
      federativeEntity: 'any_federative_entity',
    };

    await sut.upsert(companyData);

    expect(prismaMock.cnpjCompany.upsert).toHaveBeenCalledWith({
      where: { baseCnpj: 'any_base_cnpj' },
      create: companyData,
      update: companyData,
    });
  });
});
