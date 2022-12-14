import { DataUrlType } from '../domain/models/DataUrl';
import { CnpjRawDataParser } from '../domain/utils';

export class CnpjRawDataParserAdapter implements CnpjRawDataParser {
  private readonly parsers = {
    COMPANY: this.parseCompanyData,
    ESTABLISHMENT: this.parseEstablishmentData,
    SIMPLES: this.parseSimplesData.bind(this),
    PARTNER: this.parsePartnerData,
    COUNTRIES: this.parseCountryData,
    CITIES: this.parseCityData,
    CNAE: this.parseCnaeData,
    REASONS: this.parseReasonData,
  } as { [key in DataUrlType]: (data: string[]) => Object };

  parse(data: string, dataType: DataUrlType): Object {
    const dataToParse = this.removeNonASCII(data).replace(/"/g, '').split(';');
    const parser = this.parsers[dataType];
    const parsedData = parser(dataToParse);

    return parsedData;
  }

  private removeNonASCII(input: string): string {
    return input.replace(/[^\x20-\x7E]/g, '');
  }

  private parseCompanyData(data: string[]): Object {
    const [baseCnpj, corporateName, legalNature, qualification, capital, size, federativeEntity] =
      data;

    return {
      baseCnpj,
      corporateName,
      legalNature,
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
      corporateName,
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
      city,
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

    const fullTelephone1 = `(${ddd1}) ${telephone1}`;
    const fullTelephone2 = !!ddd2 && !!telephone2 ? `(${ddd2}) ${telephone2}` : '';
    const fullFax = !!faxDdd && !!fax ? `${faxDdd} ${fax}` : '';

    return {
      baseCnpj,
      cnpj,
      corporateName,
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
        countryCode,
        streetDescription,
        street,
        number,
        complement,
        district,
        cep,
        uf,
        city,
      },
    };
  }

  private parseSimplesData(data: string[]): Object {
    const [
      baseCnpj,
      identification,
      identificationDate,
      exclusionDate,
      meiIdentification,
      meiIdentificationDate,
      meiExclusionDate,
    ] = data;

    return {
      baseCnpj,
      identification: this.parseDataToBoolean(identification),
      identificationDate,
      exclusionDate,
      meiIdentification: this.parseDataToBoolean(meiIdentification),
      meiIdentificationDate,
      meiExclusionDate,
    };
  }

  private parseDataToBoolean(data: string): boolean {
    return data === 'S';
  }

  private parsePartnerData(data: string[]): Object {
    const [
      baseCnpj,
      identifier,
      name,
      registration,
      qualification,
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
      registration,
      qualification,
      entryDate,
      countryCode,
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

  private parseCnaeData(data: string[]): Object {
    const [code, description] = data;
    return { code, description };
  }

  private parseReasonData(data: string[]): Object {
    const [code, description] = data;
    return { code, description };
  }
}
