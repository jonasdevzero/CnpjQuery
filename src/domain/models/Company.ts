export interface CompanyModel {
  id: string;
  baseCnpj: string;
  corporateName: string;
  legalNature: string;
  qualification: string;
  capital: string;
  size: string;
  federativeEntity?: string;
}

export type UpsertCompanyModel = Omit<CompanyModel, 'id'>;
