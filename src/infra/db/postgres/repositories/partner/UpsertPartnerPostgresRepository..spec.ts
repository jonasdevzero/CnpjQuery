import { dbMock } from '../../dbMock';
import { UpsertPartnerModel } from '../../../../../domain/models/Partner';
import { UpsertPartnerPostgresRepository } from './UpsertPartnerPostgresRepository';

const makeFakePartnerData = (): UpsertPartnerModel => {
  const partner = {
    baseCnpj: 'any_baseCnpj',
    identifier: 'any_identifier',
    name: 'any_name',
    cpf: 'any_registration',
    qualificationCode: 'any_qualification',
    entryDate: 'any_entryDate',
    countryCode: 'any_countryCode',
    legalRepresentativeCpf: 'any_legalRepresentativeCpf',
    legalRepresentativeName: 'any_legalRepresentativeName',
    legalRepresentativeQualification: 'any_legalRepresentativeQualification',
    ageGroup: 'any_ageGroup',
  };
  return partner;
};

describe('UpsertPartnerPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = new UpsertPartnerPostgresRepository();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.upsert(makeFakePartnerData())).rejects.toThrow();
  });
});
