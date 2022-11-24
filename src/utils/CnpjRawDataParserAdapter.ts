import { DataUrlType } from '../domain/models/DataUrl';
import { CnpjRawDataParser } from '../presentation/protocols/CnpjRawDataParser';

export class CnpjRawDataParserAdapter implements CnpjRawDataParser {
  private readonly parsers = {
    COMPANY: this.parseCompanyData,
    ESTABLISHMENT: this.parseEstablishmentData,
    SIMPLES: this.parseSimplesData.bind(this),
    PARTNER: this.parsePartnerData,
  } as { [key in DataUrlType]: (data: string[]) => Object };

  parse(data: string, dataType: DataUrlType): Object {
    const dataToParse = data.replace(/"/g, '').split(';');
    const parser = this.parsers[dataType];
    const parsedData = parser(dataToParse);

    return parsedData;
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

    const formattedBaseCnpj = baseCnpj.replace(
      /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
      '$1.$2.$3',
    );
    const cnpj = `${formattedBaseCnpj}/${orderCnpj}-${dvCnpj}`;

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
}
