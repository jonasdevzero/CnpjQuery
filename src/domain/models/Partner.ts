export interface UpsertPartnerModel {
  baseCnpj: string;
  identifier: string;
  name: string;
  cpf: string;
  qualificationCode: string;
  entryDate: string;
  countryCode: string | null;
  legalRepresentativeCpf: string;
  legalRepresentativeName: string;
  legalRepresentativeQualification: string;
  ageGroup: string;
}
