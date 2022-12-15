export interface UpsertEstablishmentModel {
  baseCnpj: string;
  cnpj: string;
  fantasyName: string | null;

  cadasterStatus: string;
  cadasterStatusDate: string;
  cadasterStatusReason: string;

  activityStartAt: string;

  mainCnae: string;
  secondaryCnae: string | null;

  specialStatus: string;
  specialStatusDate: string;

  telephone1: string;
  telephone2: string | null;
  fax: string | null;
  email: string;

  address: {
    cityAbroad: string;
    countryCode: string;
    streetDescription: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    cep: string;
    uf: string;
    cityCode: string;
  };
}
