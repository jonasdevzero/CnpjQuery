/* eslint-disable no-control-regex */
import { DataUrlType } from '@domain/models/DataUrl';
import { CnpjRawDataParser } from '@domain/utils';

export class CnpjRawDataParserAdapter implements CnpjRawDataParser {
  private readonly parsers = {
    COMPANY: this.parseCompanyData.bind(this),
    ESTABLISHMENT: this.parseEstablishmentData.bind(this),
    SIMPLES: this.parseSimplesData.bind(this),
    PARTNER: this.parsePartnerData.bind(this),
    COUNTRIES: this.parseCountryData.bind(this),
    CITIES: this.parseCityData.bind(this),
    CNAE: this.parseGeneralData.bind(this),
    REASONS: this.parseGeneralData.bind(this),
    NATURES: this.parseGeneralData.bind(this),
    QUALIFICATIONS: this.parseGeneralData.bind(this),
  } as { [key in DataUrlType]: (data: Array<string | null>) => Object };

  parse(data: string, dataType: DataUrlType): Object {
    const dataToParse = data.split('<->').map((d) => (!d ? null : d));
    const parser = this.parsers[dataType];
    const parsedData = parser(dataToParse);

    return parsedData;
  }

  private parseCompanyData(data: string[]): Object {
    const [
      baseCnpj,
      corporateName,
      legalNatureCode,
      qualification,
      capital,
      size,
      federativeEntity,
    ] = data;

    return {
      baseCnpj,
      corporateName,
      legalNatureCode,
      qualification,
      capital,
      size,
      federativeEntity,
    };
  }

  private parseEstablishmentData(data: string[]): Object {
    const [
      baseCnpj,
      orderCnpj,
      dvCnpj,
      _identifier,
      fantasyName,
      cadasterStatus,
      cadasterStatusDate,
      cadasterStatusReason,
      cityAbroad,
      countryCode,
      activityStartAt,
      mainCnae,
      secondaryCnae,
      streetDescription,
      street,
      number,
      complement,
      district,
      cep,
      uf,
      cityCode,
      ddd1,
      telephone1,
      ddd2,
      telephone2,
      faxDdd,
      fax,
      email,
      specialStatus,
      specialStatusDate,
    ] = data;

    const cnpj = `${baseCnpj}${orderCnpj}${dvCnpj}`;
    const fullTelephone1 = ddd1 && telephone1 ? `${ddd1}${telephone1}` : null;
    const fullTelephone2 = ddd2 && telephone2 ? `${ddd2}${telephone2}` : null;
    const fullFax = faxDdd && fax ? `${faxDdd}${fax}` : null;

    return {
      baseCnpj,
      cnpj,
      fantasyName,
      cadasterStatus,
      cadasterStatusDate,
      cadasterStatusReason,
      activityStartAt,
      mainCnae,
      secondaryCnae,
      specialStatus,
      specialStatusDate,
      telephone1: fullTelephone1,
      telephone2: fullTelephone2,
      fax: fullFax,
      email,

      address: {
        cityAbroad,
        countryCode: this.parseCountryCode(countryCode),
        streetDescription,
        street,
        number,
        complement,
        district,
        cep,
        uf,
        cityCode,
      },
    };
  }

  private parseCountryCode(countryCode: string): string | null {
    if (!countryCode) return null;
    return countryCode.length < 3 ? `0${countryCode}` : countryCode;
  }

  private parseSimplesData(data: string[]): Object {
    const [
      baseCnpj,
      isSimples,
      simplesSince,
      simplesExclusionDate,
      isMei,
      meiSince,
      meiExclusionDate,
    ] = data;

    return {
      baseCnpj,
      isSimples: this.parseDataToBoolean(isSimples),
      simplesSince,
      simplesExclusionDate,
      isMei: this.parseDataToBoolean(isMei),
      meiSince,
      meiExclusionDate,
    };
  }

  private parseDataToBoolean(data: string | null): boolean | null {
    if (!data) return null;
    return data === 'S';
  }

  private parsePartnerData(data: string[]): Object {
    const [
      baseCnpj,
      identifier,
      name,
      cpf,
      qualificationCode,
      entryDate,
      countryCode,
      legalRepresentativeCpf,
      legalRepresentativeName,
      legalRepresentativeQualification,
      ageGroup,
    ] = data;

    return {
      baseCnpj,
      identifier,
      name,
      cpf: cpf || '',
      qualificationCode,
      entryDate,
      countryCode: this.parseCountryCode(countryCode),
      legalRepresentativeCpf,
      legalRepresentativeName,
      legalRepresentativeQualification,
      ageGroup,
    };
  }

  private parseCountryData(data: string[]): Object {
    const [code, name] = data;
    return { code, name };
  }

  private parseCityData(data: string[]): Object {
    const [code, name] = data;
    return { code, name };
  }

  private parseGeneralData(data: string[]): Object {
    const [code, description] = data;
    return { code, description };
  }
}
