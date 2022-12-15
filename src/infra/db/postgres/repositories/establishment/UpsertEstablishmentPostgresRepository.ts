import { UpsertEstablishmentRepository } from '../../../../../data/protocols/UpsertEstablishmentRepository';
import { UpsertEstablishmentModel } from '../../../../../domain/models/Establishment';
import sql from '../../db';

export class UpsertEstablishmentPostgresRepository implements UpsertEstablishmentRepository {
  async upsert(data: UpsertEstablishmentModel): Promise<void> {
    const {
      cnpj,
      baseCnpj,
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
        cityCode,
      },
    } = data;

    await sql`
      INSERT INTO "establishment" (
        cnpj, "baseCnpj", "fantasyName", "cadasterStatus", "cadasterStatusDate", "cadasterStatusReason",
        "activityStartAt", "mainCnae", "secondaryCnae", "specialStatus", "specialStatusDate",
        "telephone1", "telephone2", fax, email, "cityAbroad", "countryCode", "streetDescription",
        "street", "number", "complement", "district", "cep", "uf", "cityCode"
      ) VALUES (
        ${cnpj}, ${baseCnpj}, ${fantasyName}, ${cadasterStatus},
        ${cadasterStatusDate}, ${cadasterStatusReason},  ${activityStartAt},
        ${mainCnae}, ${secondaryCnae}, ${specialStatus},
        ${specialStatusDate}, ${telephone1}, ${telephone2},
        ${fax}, ${email}, ${cityAbroad},  ${countryCode},
        ${streetDescription}, ${street}, ${number}, ${complement},
        ${district}, ${cep}, ${uf}, ${cityCode}
      )
      ON CONFLICT ("cnpj") DO
      UPDATE SET "fantasyName" = ${fantasyName},
      "cadasterStatus" = ${cadasterStatus}, "cadasterStatusDate" = ${cadasterStatusDate},
        "cadasterStatusReason" = ${cadasterStatusReason}, "activityStartAt" = ${activityStartAt},
        "mainCnae" = ${mainCnae}, "secondaryCnae" = ${secondaryCnae},
        "specialStatus" = ${specialStatus}, "specialStatusDate" = ${specialStatusDate},
        "telephone1" = ${telephone1}, "telephone2" = ${telephone2},
        fax = ${fax}, email = ${email}, "cityAbroad" = ${cityAbroad},
        "countryCode" = ${countryCode}, "streetDescription" = ${streetDescription},
        "street" = ${street}, "number" = ${number}, "complement" = ${complement},
        "district" = ${district}, "cep" = ${cep},  "uf" = ${uf}, "cityCode" = ${cityCode}
      WHERE "establishment".cnpj = ${cnpj};
    `;
  }
}