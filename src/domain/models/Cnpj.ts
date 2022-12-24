import { CnaeModel } from './Cnae';

export interface CnpjModel {
  cnpj: string;
  fantasyName: string;
  cadasterStatus: string;
  cadasterStatusDate: string | null;
  cadasterStatusReason: string;
  activityStartAt: string;

  mainCnae: CnaeModel;
  secondaryCnae: CnaeModel[];

  specialStatus: string | null;
  specialStatusDate: string | null;

  telephone1: string | null;
  telephone2: string | null;
  fax: string | null;
  email: string | null;

  isSimples: boolean | null;
  simplesSince: string | null;
  simplesExclusionDate: string | null;
  isMei: boolean | null;
  meiSince: string | null;
  meiExclusionDate: string | null;

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
