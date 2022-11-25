import { prismaMock } from '../../clientMock';
import { UpsertSimplesPrismaRepository } from './UpsertSimplesPrismaRepository';

describe('UpsertSimplesPrismaRepository', () => {
  test('Should call prisma upsert with correct values', async () => {
    const sut = new UpsertSimplesPrismaRepository();

    const simplesData = {
      baseCnpj: 'any_base_cnpj',
      identification: false,
      identificationDate: 'any_date',
      exclusionDate: 'any_data',
      meiIdentification: false,
      meiIdentificationDate: 'any_date',
      meiExclusionDate: 'any_date',
    };

    await sut.upsert(simplesData);

    expect(prismaMock.cnpj.upsert).toHaveBeenCalledWith({
      where: { baseCnpj: 'any_base_cnpj' },
      create: { baseCnpj: 'any_base_cnpj' },
      update: {},
    });
    expect(prismaMock.cnpjSimples.upsert).toHaveBeenCalledWith({
      where: { baseCnpj: 'any_base_cnpj' },
      create: simplesData,
      update: simplesData,
    });
  });
});
