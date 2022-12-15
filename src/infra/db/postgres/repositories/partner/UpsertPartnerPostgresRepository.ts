import { UpsertPartnerRepository } from '../../../../../data/protocols/UpsertPartnerRepository';
import { UpsertPartnerModel } from '../../../../../domain/models/Partner';
import sql from '../../db';

export class UpsertPartnerPostgresRepository implements UpsertPartnerRepository {
  async upsert(data: UpsertPartnerModel): Promise<void> {
    const {
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
    } = data;

    await sql`
      INSERT INTO "partner" ("baseCnpj", "identifier", "name", "cpf", "qualificationCode",
      "countryCode", "legalRepresentativeCpf", "legalRepresentativeName", "legalRepresentativeQualification",
        "ageGroup", "entryDate")
      VALUES (${baseCnpj}, ${identifier}, ${name}, ${cpf}, ${qualificationCode},${countryCode},
        ${legalRepresentativeCpf}, ${legalRepresentativeName}, ${legalRepresentativeQualification},
        ${ageGroup}, ${entryDate})
      ON CONFLICT ("baseCnpj", "cpf") DO
      UPDATE SET "identifier" = ${identifier}, "name" = ${name},
        "qualificationCode" = ${qualificationCode}, "entryDate" = ${entryDate}, "countryCode" = ${countryCode},
        "legalRepresentativeCpf" = ${legalRepresentativeCpf}, "legalRepresentativeName" = ${legalRepresentativeName},
        "legalRepresentativeQualification" = ${legalRepresentativeQualification}, "ageGroup" = ${ageGroup}
      WHERE "partner"."baseCnpj" = ${baseCnpj} AND "partner"."cpf" = ${cpf};
      `;
  }
}
