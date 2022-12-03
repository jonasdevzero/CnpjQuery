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

  test('Should insert data if establishment was not found', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return [];
    });

    await sut.upsert(makeFakeEstablishment());

    const query = dbMock.mock.calls[1][0].join('').trim();

    expect(query).toMatch(/^[INSERT INTO].+/g);
  });

  test('Should update data if establishment was found', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return ['any_establishment'];
    });

    await sut.upsert(makeFakeEstablishment());

    const query = dbMock.mock.calls[1][0].join('').trim();

    expect(query).toMatch(/^[UPDATE].+/g);
  });

  test('Should replace undefined values to a valid value on insert', async () => {
    const sut = makeSut();

    const establishmentData = makeFakeEstablishment();
    Object.assign(establishmentData, {
      corporateName: undefined,
      secondaryCnae: undefined,
      telephone2: undefined,
      fax: undefined,
    });

    dbMock.mockImplementationOnce(() => {
      return [];
    });

    await sut.upsert(establishmentData);

    const query: string = dbMock.mock.calls[1][0].join('').trim();

    const insertFields = (/INSERT INTO.+\((.+)\) VALUES (.+)?/gs.exec(query) as RegExpExecArray)[1]
      .replace(/[" \n]/g, '')
      .split(',');

    const insertedValues: unknown[] = dbMock.mock.calls[1].slice(1);

    const corporateNamePosition = insertFields.indexOf('corporateName');
    const secondaryCnaePosition = insertFields.indexOf('secondaryCnae');
    const telephone2Position = insertFields.indexOf('telephone2');
    const faxPosition = insertFields.indexOf('fax');

    expect(insertedValues[corporateNamePosition]).toBe('');
    expect(insertedValues[secondaryCnaePosition]).toBe('');
    expect(insertedValues[telephone2Position]).toBe('');
    expect(insertedValues[faxPosition]).toBe('');
  });
});
