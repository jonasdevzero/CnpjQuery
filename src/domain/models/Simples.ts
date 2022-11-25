export interface UpsertSimplesModel {
  baseCnpj: string;

  identification: boolean;
  identificationDate?: string;
  exclusionDate?: string;

  meiIdentification: boolean;
  meiIdentificationDate?: string;
  meiExclusionDate?: string;
}
