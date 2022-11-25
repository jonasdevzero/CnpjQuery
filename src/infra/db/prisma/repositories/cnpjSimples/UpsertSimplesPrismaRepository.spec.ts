import { prismaMock } from '../../clientMock';
import { UpsertSimplesPrismaRepository } from './UpsertSimplesPrismaRepository';

const makeFakeSimplesData = () => {
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

const makeSut = (): UpsertSimplesPrismaRepository => {
  return new UpsertSimplesPrismaRepository();
};

describe('UpsertSimplesPrismaRepository', () => {
  test('Should call prisma upsert with correct values', async () => {
    const sut = makeSut();

    const simplesData = makeFakeSimplesData();

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

  test('Should throw if prisma upsert throws', async () => {
    const sut = makeSut();

    prismaMock.cnpjSimples.upsert.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeSimplesData())).rejects.toThrow();
  });
});
