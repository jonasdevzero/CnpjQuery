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
      qualification,
      entryDate,
      countryCode,
      legalRepresentativeCpf,
      legalRepresentativeName,
      legalRepresentativeQualification,
      ageGroup,
    } = data;

    await sql`
      INSERT INTO "cnpjPartner" ("baseCnpj", "identifier", "name", "cpf", "qualification",
      "countryCode", "legalRepresentativeCpf", "legalRepresentativeName", "legalRepresentativeQualification",
        "ageGroup", "entryDate")
      VALUES (${baseCnpj}, ${identifier}, ${name}, ${cpf}, ${qualification},${countryCode},
        ${legalRepresentativeCpf}, ${legalRepresentativeName}, ${legalRepresentativeQualification},
        ${ageGroup}, ${entryDate})
      ON CONFLICT ("baseCnpj", "cpf") DO
      UPDATE SET "identifier" = ${identifier}, "name" = ${name},
      "qualification" = ${qualification}, "entryDate"= ${entryDate}, "countryCode" = ${countryCode},
      "legalRepresentativeCpf" = ${legalRepresentativeCpf}, "legalRepresentativeName" = ${legalRepresentativeName},
      "legalRepresentativeQualification" = ${legalRepresentativeQualification}, "ageGroup" = ${ageGroup}
      WHERE "cnpjPartner"."baseCnpj" = ${baseCnpj} AND "cnpjPartner"."cpf" = ${cpf};
      `;
  }
}
