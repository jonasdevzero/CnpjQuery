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

    await sql`SELECT 1 FROM "cnpjEstablishment" WHERE "cnpj" = ${cnpj};`;

    await sql`
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
    `;
  }
}
