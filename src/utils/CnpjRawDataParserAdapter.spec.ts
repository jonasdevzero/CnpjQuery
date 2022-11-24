import { CnpjRawDataParserAdapter } from './CnpjRawDataParserAdapter';

describe('CnpjRawDataParserAdapter Util', () => {
  test('Should parse cnpj company data correctly', () => {
    const sut = new CnpjRawDataParserAdapter();

    const companyRawData =
      '"any_base_cnpj";"any_corporate_name";"any_legal_nature";"any_qualification";"any_capital";"any_size";"any_federative_entity"';

    const result = sut.parse(companyRawData, 'COMPANY');

    expect(result).toEqual({
      baseCnpj: 'any_base_cnpj',
      corporateName: 'any_corporate_name',
      legalNature: 'any_legal_nature',
      qualification: 'any_qualification',
      capital: 'any_capital',
      size: 'any_size',
      federativeEntity: 'any_federative_entity',
    });
  });

  test('Should parse cnpj establishment data correctly', () => {
    const sut = new CnpjRawDataParserAdapter();

    const establishmentData =
      '"00000000";"0001";"00";"cnpj_identifier";"any_corporate_name";"any_cadaster_status";"any_cadaster_status_date";"00";"";"";"20170919";"4729699";"";"AVENIDA";"LEONARDO ANTONIO SCHIAVINATTO";"35";"";"JARDIM PARAISO I (NOVA VENEZA)";"13179335";"SP";"7149";"19";"89501000";"19";"89501001";"19";"89501002";"any_mail@mail.com";"";""';

    const result = sut.parse(establishmentData, 'ESTABLISHMENT');

    expect(result).toEqual({
      baseCnpj: '00000000',
      cnpj: '00.000.000/0001-00',
      corporateName: 'any_corporate_name',
      cadasterStatus: 'any_cadaster_status',
      cadasterStatusDate: 'any_cadaster_status_date',
      cadasterStatusReason: '00',

      activityStartAt: '20170919',

      mainCnae: '4729699',
      secondaryCnae: '',

      specialStatus: '',
      specialStatusDate: '',

      telephone1: '(19) 89501000',
      telephone2: '(19) 89501001',
      fax: '19 89501002',
      email: 'any_mail@mail.com',

      address: {
        cityAbroad: '',
        countryCode: '',
        streetDescription: 'AVENIDA',
        street: 'LEONARDO ANTONIO SCHIAVINATTO',
        number: '35',
        complement: '',
        district: 'JARDIM PARAISO I (NOVA VENEZA)',
        cep: '13179335',
        uf: 'SP',
        city: '7149',
      },
    });
  });
});
