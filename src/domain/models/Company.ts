export interface UpsertCompanyModel {
  baseCnpj: string;
  corporateName: string;
  legalNatureCode: string;
  qualification: string;
  capital: string;
  size: string;
  federativeEntity: string | null;
}
