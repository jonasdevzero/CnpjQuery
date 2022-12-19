export interface CnpjModel {
  cnpj: string;
  fantasyName: string;
  cadasterStatus: string;
  cadasterStatusDate: string;
  cadasterStatusReason: string;
  activityStartAt: string;

  mainCnae: string | null;
  secondaryCnae: string[] | null;

  specialStatus: string | null;
  specialStatusDate: string | null;

  telephone1: string | null;
  telephone2: string | null;
  fax: string | null;
  email: string | null;

  isSimples: boolean | null;
  simplesSince: string | null;
  simplesExclusionsDate: string | null;
  isSMei: boolean | null;
  sMeiSince: string | null;
  sMeiExclusionsDate: string | null;

  address: {
    cityAbroad: string | null;
    country: string | null;
    streetDescription: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    district: string | null;
    cep: string | null;
    uf: string | null;
    city: string | null;
  };

  company: {
    corporateName: string;
    legalNature: string;
    qualification: string;
    capital: string;
    size: string;
    federativeEntity: string;

    partners: Array<{
      name: string;
      identifier: string | null;
      cpf: string | null;
      qualification: string | null;
      country: string | null;
      ageGroup: string;
      entryDate: string;

      legalRepresentativeName: string | null;
      legalRepresentativeCpf: string | null;
      legalRepresentativeQualification: string | null;
    }>;
  };
}
