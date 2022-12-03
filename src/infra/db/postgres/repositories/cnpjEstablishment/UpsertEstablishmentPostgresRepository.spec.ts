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

  test('Should insert data if establishment was not found', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return [];
    });

    await sut.upsert(makeFakeEstablishment());

    const query = dbMock.mock.calls[1][0].join('').trim();

    expect(query).toMatch(/^[INSERT INTO].+/g);
  });
});
