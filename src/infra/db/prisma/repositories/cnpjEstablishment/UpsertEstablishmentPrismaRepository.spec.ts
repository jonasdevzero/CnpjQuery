import { prismaMock } from '../../clientMock';
import { UpsertEstablishmentPrismaRepository } from './UpsertEstablishmentPrismaRepository';

describe('UpsertEstablishmentPrismaRepository', () => {
  test('Should call prisma upsert with correct values', async () => {
    const sut = new UpsertEstablishmentPrismaRepository();

    const establishmentData = {
      baseCnpj: 'any_base_cnpj',
      cnpj: 'any_cnpj',
      corporateName: '',
      cadasterStatus: '',
      cadasterStatusDate: '',
      cadasterStatusReason: '',
      activityStartAt: '',
      mainCnae: '',
      secondaryCnae: '',
      specialStatus: '',
      specialStatusDate: '',
      telephone1: '',
      telephone2: '',
      fax: '',
      email: '',
      address: {
        cityAbroad: '',
        countryCode: '',
        streetDescription: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        cep: '',
        uf: '',
        city: '',
      },
    };

    const { cnpj, address, ...rest } = establishmentData;

    await sut.upsert(establishmentData);

    expect(prismaMock.cnpj.upsert).toHaveBeenCalledWith({
      where: { baseCnpj: 'any_base_cnpj' },
      update: { cnpj: 'any_cnpj' },
      create: { cnpj: 'any_cnpj', baseCnpj: 'any_base_cnpj' },
    });
    expect(prismaMock.cnpjEstablishment.upsert).toHaveBeenCalledWith({
      where: { baseCnpj: 'any_base_cnpj' },
      update: {
        ...rest,
        address: { update: establishmentData.address },
      },
      create: {
        ...rest,
        address: { create: establishmentData.address },
      },
    });
  });
});
