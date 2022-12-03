import { UpsertEstablishmentRepository } from '../../../../../data/protocols/UpsertEstablishmentRepository';
import { UpsertEstablishmentModel } from '../../../../../domain/models/Establishment';
import sql from '../../db';

export class UpsertEstablishmentPostgresRepository implements UpsertEstablishmentRepository {
  async upsert(data: UpsertEstablishmentModel): Promise<void> {
    const {
      cnpj,
      baseCnpj,
      corporateName,
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
    } = data;

    const hasEstablishment = await sql`SELECT 1 FROM "cnpjEstablishment" WHERE "cnpj" = ${cnpj};`;

    const promise = !hasEstablishment.length
      ? sql`
        INSERT INTO "cnpjEstablishment" (
          cnpj,
          "baseCnpj",
          "corporateName",
          "cadasterStatus",
          "cadasterStatusDate",
          "cadasterStatusReason",
          "activityStartAt",
          "mainCnae",
          "secondaryCnae",
          "specialStatus",
          "specialStatusDate",
          "telephone1",
          "telephone2",
          fax,
          email,
          "cityAbroad",
          "countryCode",
          "streetDescription",
          "street",
          "number",
          "complement",
          "district",
          "cep",
          "uf",
          "city"
        ) VALUES (
          ${cnpj},
          ${baseCnpj},
          ${corporateName || ''},
          ${cadasterStatus},
          ${cadasterStatusDate},
          ${cadasterStatusReason},
          ${activityStartAt},
          ${mainCnae},
          ${secondaryCnae || ''},
          ${specialStatus},
          ${specialStatusDate},
          ${telephone1},
          ${telephone2 || ''},
          ${fax || ''},
          ${email},
          ${cityAbroad},
          ${countryCode},
          ${streetDescription},
          ${street},
          ${number},
          ${complement},
          ${district},
          ${cep},
          ${uf},
          ${city}
        );
    `
      : sql`
        UPDATE "cnpjEstablishment"
        SET "corporateName" = ${corporateName || ''},
          "cadasterStatus" = ${cadasterStatus},
          "cadasterStatusDate" = ${cadasterStatusDate},
          "cadasterStatusReason" = ${cadasterStatusReason},
          "activityStartAt" = ${activityStartAt},
          "mainCnae" = ${mainCnae},
          "secondaryCnae" = ${secondaryCnae || ''},
          "specialStatus" = ${specialStatus},
          "specialStatusDate" = ${specialStatusDate},
          "telephone1" = ${telephone1},
          "telephone2" = ${telephone2 || ''},
          fax = ${fax || ''},
          email = ${email},
          "cityAbroad" = ${cityAbroad},
          "countryCode" = ${countryCode},
          "streetDescription" = ${streetDescription},
          "street" = ${street},
          "number" = ${number},
          "complement" = ${complement},
          "district" = ${district},
          "cep" = ${cep},
          "uf" = ${uf},
          "city" = ${city}
        WHERE cnpj = ${cnpj};
      `;

    await promise;
  }
}
