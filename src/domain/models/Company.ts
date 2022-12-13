export interface UpsertCompanyModel {
  baseCnpj: string;
  corporateName: string;
  legalNature: string;
  qualification: string;
  capital: string;
  size: string;
  federativeEntity: string | null;
}
