export interface UpsertEstablishmentModel {
  baseCnpj: string;
  cnpj: string;
  corporateName?: string;

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
  fax?: string;
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
    city: string;
  };
}
