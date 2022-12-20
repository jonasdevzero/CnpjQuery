import { FindCnpjRepository } from '../../../../../data/protocols/FindCnpjRepository';
import { CnpjModel } from '../../../../../domain/models/Cnpj';
import sql from '../../db';

interface RawCnpj {
  cnpj: string;
  corporateName: string;
  legalNature: string;
  qualification: string;
  capital: string;
  size: string;
  federativeEntity: string;
  fantasyName: string;
  cadasterStatus: string;
  cadasterStatusDate: string;
  cadasterStatusReason: string;
  activityStartAt: string;
  mainCnae: string;
  secondaryCnae: string;
  specialStatus: string;
  specialStatusDate: string;
  telephone1: string;
  telephone2: string;
  fax: string;
  email: string;
  cityAbroad: string;
  country: string;
  streetDescription: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  cep: string;
  uf: string;
  city: string;
  isSimples: boolean;
  simplesSince: string;
  simplesExclusionDate: string;
  isMei: boolean;
  meiSince: string;
  meiExclusionDate: string;
  p_name: string;
  p_identifier: string;
  p_cpf: string;
  p_qualification: string;
  p_country: string;
  p_legalRepresentativeCpf: string;
  p_legalRepresentativeName: string;
  p_legalRepresentativeQualification: string;
  p_ageGroup: string;
  p_entryDate: string | null;
}

type Partner = CnpjModel['company']['partners'][number];

export class FindCnpjPostgresRepository implements FindCnpjRepository {
  private readonly cadasterStatusTypes = {
    '01': 'NULA',
    '02': 'ATIVA',
    '03': 'SUSPENSA',
    '04': 'INAPTA',
    '08': 'BAIXADA',
  };

  private readonly partnerIdentifier = {
    1: 'PESSOA JURÍDICA',
    2: 'PESSOA FÍSICA',
    3: 'ESTRANGEIRO',
  };

  private readonly companySizes = {
    '00': 'NÃO INFORMADO',
    '01': 'MICRO EMPRESA',
    '03': 'EMPRESA DE PEQUENO PORTE',
    '05': 'DEMAIS',
  };

  async find(cnpj: string): Promise<CnpjModel | null> {
    const result = await sql<RawCnpj[]>`
      SELECT
        "corporateName",
        L."description" AS "legalNature",
        "qualification",
        "capital",
        "size",
        "federativeEntity",
        "fantasyName",
        "cadasterStatus",
        "cadasterStatusDate",
        R."description" AS "cadasterStatusReason",
        "activityStartAt",
        CN."description" AS "mainCnae",
        "secondaryCnae",
        "specialStatus",
        "specialStatusDate",
        "telephone1",
        "telephone2",
        "fax",
        "email",
        "cityAbroad",
        CO."name" as "country",
        "streetDescription",
        "street",
        "number",
        "complement",
        "district",
        "cep",
        "uf",
        CI."name" as "city",
        "isSimples",
        "simplesSince",
        "simplesExclusionDate",
        "isMei",
        "meiSince",
        "meiExclusionDate",
        P."name" as "p_name",
        P."identifier" as "p_identifier",
        P."cpf" as "p_cpf",
        Q."description" as "p_qualification",
        CO_P."name" as "p_country",
        P."legalRepresentativeCpf" as "p_legalRepresentativeCpf",
        P."legalRepresentativeName" as "p_legalRepresentativeName",
        Q_LR."description" as "p_legalRepresentativeQualification",
        P."ageGroup" as "p_ageGroup",
        P."entryDate" as "p_entryDate"
      FROM establishment AS E
      LEFT JOIN company AS C ON E."baseCnpj" = C."baseCnpj"
      LEFT JOIN country AS CO ON E."countryCode" = CO."code"
      LEFT JOIN city AS CI ON E."cityCode" = CI."code"
      LEFT JOIN reason AS R ON E."cadasterStatusReason" = R."code"
      LEFT JOIN simples AS S ON S."baseCnpj" = E."baseCnpj"
      LEFT JOIN cnae AS CN ON CN."code" = E."mainCnae"
      LEFT JOIN "legalNature" AS L ON L."code" = C."legalNatureCode"
      LEFT JOIN partner AS P ON P."baseCnpj" = E."baseCnpj"
      LEFT JOIN qualification AS Q ON P."qualificationCode" = Q."code"
      LEFT JOIN country AS CO_P ON P."countryCode" = CO_P."code"
      LEFT JOIN qualification AS Q_LR ON P."legalRepresentativeQualification" = Q_LR."code"
      WHERE E.cnpj = ${cnpj};
    `;

    if (!result.length) return null;

    const {
      corporateName,
      legalNature,
      qualification,
      capital,
      size,
      federativeEntity,
      fantasyName,
      cadasterStatus,
      cadasterStatusDate,
      cadasterStatusReason,
      activityStartAt,
      mainCnae,
      secondaryCnae,
      specialStatus,
      specialStatusDate,
      telephone1,
      telephone2,
      fax,
      email,
      cityAbroad,
      country,
      streetDescription,
      street,
      number,
      complement,
      district,
      cep,
      uf,
      city,
      isSimples,
      simplesSince,
      simplesExclusionDate,
      isMei,
      meiSince,
      meiExclusionDate,
    } = result[0];

    return {
      cnpj,
      fantasyName,
      cadasterStatus: this.cadasterStatusTypes[cadasterStatus],
      cadasterStatusDate: this.parseRawDate(cadasterStatusDate),
      cadasterStatusReason,
      activityStartAt,

      mainCnae,
      secondaryCnae: secondaryCnae ? secondaryCnae.split(',') : [],
      specialStatus,
      specialStatusDate: this.parseRawDate(specialStatusDate),

      telephone1,
      telephone2,
      fax,
      email,

      isSimples,
      simplesSince: this.parseRawDate(simplesSince),
      simplesExclusionDate: this.parseRawDate(simplesExclusionDate),
      isMei,
      meiSince: this.parseRawDate(meiSince),
      meiExclusionDate: this.parseRawDate(meiExclusionDate),

      address: {
        cityAbroad,
        country,
        streetDescription,
        street,
        number,
        complement,
        district,
        cep,
        uf,
        city,
      },

      company: {
        corporateName,
        legalNature,
        qualification,
        capital,
        size: this.companySizes[size],
        federativeEntity,

        partners: this.getPartners(result),
      },
    };
  }

  private parseRawDate(date: string | null) {
    if (!date) return null;
    return date.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$1-$2-$3');
  }

  private getPartners(rawData: RawCnpj[]): Partner[] {
    const partners = [] as Partner[];

    rawData.forEach((data) => {
      const partner = {} as Partner;

      const identifier = Number(data.p_identifier);

      data.p_entryDate = this.parseRawDate(data.p_entryDate);
      data.p_identifier = this.partnerIdentifier[identifier] || null;

      Object.entries(data).forEach(([key, value]) => {
        if (!key.startsWith('p_')) return;

        const partnerKey = key.split('_')[1];
        partner[partnerKey] = value;
      });

      if (Object.keys(partner).length) {
        partners.push(partner);
      }
    });

    return partners;
  }
}
