export type DataUrlType =
  | 'COMPANY'
  | 'ESTABLISHMENT'
  | 'SIMPLES'
  | 'PARTNER'
  | 'COUNTRIES'
  | 'CITIES'
  | 'CNAE'
  | 'REASONS'
  | 'NATURES'
  | 'QUALIFICATIONS';

export interface DataUrlModel {
  id: string;
  url: string;
  type: DataUrlType;
}
