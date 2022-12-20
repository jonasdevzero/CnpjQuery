import { dbMock } from '../../dbMock';
import { FindCnpjPostgresRepository } from './FindCnpjPostgresRepository';

const makeSut = () => {
  return new FindCnpjPostgresRepository();
};

describe('FindCnpjPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.find('any_cnpj')).rejects.toThrow();
  });

  test('Should return null if cnpj was not found', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => []);

    const cnpj = await sut.find('any_cnpj');

    expect(cnpj).toBeNull();
  });

  test('Should return cnpj if success', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      const cnpj = {
        cnpj: 'any_cnpj',
        corporateName: 'any_corporate_name',
        legalNature: 'any_legal_nature',
        qualification: 'any_qualification',
        capital: 'any_capital',
        size: '00',
        federativeEntity: 'any_federative_entity',
        fantasyName: 'any_fantasy_name',
        cadasterStatus: '02',
        cadasterStatusDate: '20000515',
        cadasterStatusReason: 'any_cadaster_status_reason',
        activityStartAt: 'any_activity_start_at',
        mainCnae: 'any_cnae',
        secondaryCnae: 'any_cnae,any_cnae,any_cnae',
        specialStatus: 'any_special_status',
        specialStatusDate: null,
        telephone1: 'any_telephone',
        telephone2: 'any_telephone',
        fax: 'any_fax',
        email: 'any_email',
        cityAbroad: 'any_city_abroad',
        country: 'any_country',
        streetDescription: 'any_street_description',
        street: 'any_street',
        number: 'any_number',
        complement: 'any_complement',
        district: 'any_district',
        cep: 'any_cep',
        uf: 'any_uf',
        city: 'any_city',
        isSimples: true,
        simplesSince: '20000515',
        simplesExclusionDate: '20000515',
        isMei: true,
        meiSince: '20000515',
        meiExclusionDate: '20000515',
        p_name: 'any_partner_name',
        p_identifier: '2',
        p_cpf: 'any_cpf',
        p_qualification: 'any_partner_qualification',
        p_country: 'any_partner_country',
        p_legalRepresentativeCpf: 'any_legal_representative_cpf',
        p_legalRepresentativeName: 'any_legal_representative_name',
        p_legalRepresentativeQualification: 'any_legal_representative_qualification',
        p_ageGroup: 'any_age_group',
        p_entryDate: '20000515',
      };
      return [cnpj, { ...cnpj }];
    });

    const cnpj = await sut.find('any_cnpj');

    expect(cnpj).toEqual({
      cnpj: 'any_cnpj',
      fantasyName: 'any_fantasy_name',
      cadasterStatus: 'ATIVA',
      cadasterStatusDate: '2000-05-15',
      cadasterStatusReason: 'any_cadaster_status_reason',
      activityStartAt: 'any_activity_start_at',

      mainCnae: 'any_cnae',
      secondaryCnae: ['any_cnae', 'any_cnae', 'any_cnae'],
      specialStatus: 'any_special_status',
      specialStatusDate: null,

      telephone1: 'any_telephone',
      telephone2: 'any_telephone',
      fax: 'any_fax',
      email: 'any_email',

      isSimples: true,
      simplesSince: '2000-05-15',
      simplesExclusionDate: '2000-05-15',
      isMei: true,
      meiSince: '2000-05-15',
      meiExclusionDate: '2000-05-15',

      address: {
        cityAbroad: 'any_city_abroad',
        country: 'any_country',
        streetDescription: 'any_street_description',
        street: 'any_street',
        number: 'any_number',
        complement: 'any_complement',
        district: 'any_district',
        cep: 'any_cep',
        uf: 'any_uf',
        city: 'any_city',
      },

      company: {
        corporateName: 'any_corporate_name',
        legalNature: 'any_legal_nature',
        qualification: 'any_qualification',
        capital: 'any_capital',
        size: 'NÃO INFORMADO',
        federativeEntity: 'any_federative_entity',

        partners: [
          {
            name: 'any_partner_name',
            identifier: 'PESSOA FÍSICA',
            cpf: 'any_cpf',
            qualification: 'any_partner_qualification',
            country: 'any_partner_country',
            legalRepresentativeCpf: 'any_legal_representative_cpf',
            legalRepresentativeName: 'any_legal_representative_name',
            legalRepresentativeQualification: 'any_legal_representative_qualification',
            ageGroup: 'any_age_group',
            entryDate: '2000-05-15',
          },
          {
            name: 'any_partner_name',
            identifier: 'PESSOA FÍSICA',
            cpf: 'any_cpf',
            qualification: 'any_partner_qualification',
            country: 'any_partner_country',
            legalRepresentativeCpf: 'any_legal_representative_cpf',
            legalRepresentativeName: 'any_legal_representative_name',
            legalRepresentativeQualification: 'any_legal_representative_qualification',
            ageGroup: 'any_age_group',
            entryDate: '2000-05-15',
          },
        ],
      },
    });
  });
});
