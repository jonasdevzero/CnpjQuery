export interface UpsertSimplesModel {
  baseCnpj: string;

  identification: boolean;
  identificationDate: string | null;
  exclusionDate: string | null;

  meiIdentification: boolean;
  meiIdentificationDate: string | null;
  meiExclusionDate: string | null;
}
