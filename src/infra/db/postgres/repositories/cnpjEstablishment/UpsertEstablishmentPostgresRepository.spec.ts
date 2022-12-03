import { UpsertEstablishmentModel } from '../../../../../domain/models/Establishment';
import { dbMock } from '../../dbMock';
import { UpsertEstablishmentPostgresRepository } from './UpsertEstablishmentPostgresRepository';

const makeFakeEstablishment = (): UpsertEstablishmentModel => {
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
  return establishmentData;
};

describe('UpsertEstablishmentPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = new UpsertEstablishmentPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeEstablishment())).rejects.toThrow();
  });
});
