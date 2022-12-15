export interface UpsertSimplesModel {
  baseCnpj: string;

  isSimples: boolean;
  simplesSince: string | null;
  simplesExclusionDate: string | null;

  isMei: boolean;
  meiSince: string | null;
  meiExclusionDate: string | null;
}
