import { FindCnpjRepository } from '../../../../../data/protocols/FindCnpjRepository';
import { CnpjModel } from '../../../../../domain/models/Cnpj';
import sql from '../../db';

export class FindCnpjPostgresRepository implements FindCnpjRepository {
  async find(cnpj: string): Promise<CnpjModel | null> {
    await sql`
      SELECT cnpj,
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

    return null;
  }
}
