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
});
