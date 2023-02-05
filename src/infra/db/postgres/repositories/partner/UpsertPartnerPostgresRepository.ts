import { UpsertPartnerRepository } from '@data/protocols';
import { UpsertPartnerModel } from '@domain/models';
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

    if (!baseCnpj || !name) return;

    try {
      await sql`
        INSERT INTO "partner" ("baseCnpj", "identifier", "name", "cpf", "qualificationCode",
        "countryCode", "legalRepresentativeCpf", "legalRepresentativeName", "legalRepresentativeQualification",
          "ageGroup", "entryDate")
        VALUES (${baseCnpj}, ${identifier}, ${name}, ${cpf}, ${qualificationCode},${countryCode},
          ${legalRepresentativeCpf}, ${legalRepresentativeName}, ${legalRepresentativeQualification},
          ${ageGroup}, ${entryDate})
        ON CONFLICT ("baseCnpj", "cpf") DO
        UPDATE SET "identifier" = ${identifier}, "qualificationCode" = ${qualificationCode}, "countryCode" = ${countryCode},
          "legalRepresentativeCpf" = ${legalRepresentativeCpf}, "legalRepresentativeName" = ${legalRepresentativeName},
          "legalRepresentativeQualification" = ${legalRepresentativeQualification}, "ageGroup" = ${ageGroup}
        WHERE "partner"."baseCnpj" = ${baseCnpj} AND "partner"."cpf" = ${cpf} AND "partner"."name" = ${name};
      `;
    } catch (error) {
      const err = error as Error;

      if (/partner_countryCode_fkey/g.test(err.message)) {
        await this.upsert({ ...data, countryCode: null });
        return;
      }

      throw error;
    }
  }
}
