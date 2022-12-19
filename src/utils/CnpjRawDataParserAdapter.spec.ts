import { CnpjRawDataParserAdapter } from './CnpjRawDataParserAdapter';

const makeSut = (): CnpjRawDataParserAdapter => {
  return new CnpjRawDataParserAdapter();
};

describe('CnpjRawDataParserAdapter Util', () => {
  test('Should parse cnpj company data correctly', () => {
    const sut = makeSut();

    const companyRawData =
      'any_base_cnpj<->any_corporate_name<->any_legal_nature<->any_qualification<->any_capital<->any_size<->any_federative_entity';

    const result = sut.parse(companyRawData, 'COMPANY');

    expect(result).toEqual({
      baseCnpj: 'any_base_cnpj',
      corporateName: 'any_corporate_name',
      legalNatureCode: 'any_legal_nature',
      qualification: 'any_qualification',
      capital: 'any_capital',
      size: 'any_size',
      federativeEntity: 'any_federative_entity',
    });
  });

  test('Should parse cnpj establishment data correctly', () => {
    const sut = makeSut();

    const establishmentData =
      '00000000<->0001<->00<->cnpj_identifier<->any_corporate_name<->any_cadaster_status<->any_cadaster_status_date<->00<-><-><->20170919<->4729699<-><->AVENIDA<->LEONARDO ANTONIO SCHIAVINATTO<->35<-><->JARDIM PARAISO I (NOVA VENEZA)<->13179335<->SP<->7149<->19<->89501000<->19<->89501001<->19<->89501002<->any_mail@mail.com<-><->';

    const result = sut.parse(establishmentData, 'ESTABLISHMENT');

    expect(result).toEqual({
      baseCnpj: '00000000',
      cnpj: '00000000000100',
      fantasyName: 'any_corporate_name',
      cadasterStatus: 'any_cadaster_status',
      cadasterStatusDate: 'any_cadaster_status_date',
      cadasterStatusReason: '00',

      activityStartAt: '20170919',

      mainCnae: '4729699',
      secondaryCnae: null,

      specialStatus: null,
      specialStatusDate: null,

      telephone1: '1989501000',
      telephone2: '1989501001',
      fax: '1989501002',
      email: 'any_mail@mail.com',

      address: {
        cityAbroad: null,
        countryCode: null,
        streetDescription: 'AVENIDA',
        street: 'LEONARDO ANTONIO SCHIAVINATTO',
        number: '35',
        complement: null,
        district: 'JARDIM PARAISO I (NOVA VENEZA)',
        cep: '13179335',
        uf: 'SP',
        cityCode: '7149',
      },
    });
  });

  test('Should parse cnpj simples data correctly', () => {
    const sut = makeSut();

    const simplesData = '00000000<->N<->20070701<->20070701<->N<->20090701<->20090701';

    const result = sut.parse(simplesData, 'SIMPLES');

    expect(result).toEqual({
      baseCnpj: '00000000',

      isSimples: false,
      simplesSince: '20070701',
      simplesExclusionDate: '20070701',

      isMei: false,
      meiSince: '20090701',
      meiExclusionDate: '20090701',
    });
  });

  test('Should parse cnpj partner data correctly', () => {
    const sut = makeSut();

    const partnerData =
      'any_base_cnpj<->any_identifier<->any_partner_name<->any_registration<->any_qualification<->start_at<->any_country<->legal_representative_cpf<->legal_representative_name<->legal_representative_qualification<->any_age_group';

    const result = sut.parse(partnerData, 'PARTNER');

    expect(result).toEqual({
      baseCnpj: 'any_base_cnpj',
      identifier: 'any_identifier',
      name: 'any_partner_name',
      cpf: 'any_registration',
      qualificationCode: 'any_qualification',
      countryCode: 'any_country',
      legalRepresentativeCpf: 'legal_representative_cpf',
      legalRepresentativeName: 'legal_representative_name',
      legalRepresentativeQualification: 'legal_representative_qualification',
      ageGroup: 'any_age_group',
      entryDate: 'start_at',
    });
  });

  test('Should parse countries data correctly', () => {
    const sut = makeSut();

    const countriesData = 'any_code<->any_name';

    const result = sut.parse(countriesData, 'COUNTRIES');

    expect(result).toEqual({ code: 'any_code', name: 'any_name' });
  });

  test('Should parse city data correctly', () => {
    const sut = makeSut();

    const citiesData = 'any_code<->any_name';

    const result = sut.parse(citiesData, 'CITIES');

    expect(result).toEqual({ code: 'any_code', name: 'any_name' });
  });

  test('Should parse cnae data correctly', () => {
    const sut = makeSut();

    const cnaeData = 'any_code<->any_description';

    const result = sut.parse(cnaeData, 'CNAE');

    expect(result).toEqual({ code: 'any_code', description: 'any_description' });
  });

  test('Should parse reason data correctly', () => {
    const sut = makeSut();

    const reasonData = 'any_code<->any_description';

    const result = sut.parse(reasonData, 'REASONS');

    expect(result).toEqual({ code: 'any_code', description: 'any_description' });
  });

  test('Should parse nature data correctly', () => {
    const sut = makeSut();

    const natureData = 'any_code<->any_description';

    const result = sut.parse(natureData, 'NATURES');

    expect(result).toEqual({ code: 'any_code', description: 'any_description' });
  });

  test('Should parse qualification data correctly', () => {
    const sut = makeSut();

    const qualificationData = 'any_code<->any_description';

    const result = sut.parse(qualificationData, 'QUALIFICATIONS');

    expect(result).toEqual({ code: 'any_code', description: 'any_description' });
  });
});
