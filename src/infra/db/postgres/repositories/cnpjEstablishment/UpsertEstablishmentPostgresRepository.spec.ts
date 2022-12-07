import { UpsertEstablishmentModel } from '../../../../../domain/models/Establishment';
import { dbMock } from '../../dbMock';
import { UpsertEstablishmentPostgresRepository } from './UpsertEstablishmentPostgresRepository';

const makeFakeEstablishment = (): UpsertEstablishmentModel => {
  const establishmentData = {
    baseCnpj: 'any_base_cnpj',
    cnpj: 'any_cnpj',
    corporateName: 'any_corporate_name',
    cadasterStatus: 'any_cadaster_status',
    cadasterStatusDate: 'any_cadaster_status',
    cadasterStatusReason: 'any_cadaster_status_reason',
    activityStartAt: 'any_activity_start_at',
    mainCnae: 'nay_cnae',
    secondaryCnae: 'any_cnae',
    specialStatus: 'any_special_status',
    specialStatusDate: 'any_special_status_reason',
    telephone1: 'any_telephone',
    telephone2: 'any_telephone',
    fax: 'any_fax',
    email: 'any_email',
    address: {
      cityAbroad: 'any_city_abroad',
      countryCode: 'any_country_code',
      streetDescription: 'any_street_description',
      street: 'any_street',
      number: 'any_number',
      complement: 'any_complement',
      district: 'any_district',
      cep: 'any_cep',
      uf: 'any_uf',
      city: 'any_city',
    },
  };
  return establishmentData;
};

const makeSut = (): UpsertEstablishmentPostgresRepository => {
  return new UpsertEstablishmentPostgresRepository();
};

describe('UpsertEstablishmentPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakeEstablishment())).rejects.toThrow();
  });

  test('Should call select with correct value', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return [];
    });

    const establishmentData = makeFakeEstablishment();

    await sut.upsert(establishmentData);

    expect(dbMock.mock.calls[0][1]).toBe(establishmentData.cnpj);
  });
});
