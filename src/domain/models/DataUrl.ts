export type DataUrlType =
  | 'COMPANY'
  | 'ESTABLISHMENT'
  | 'SIMPLES'
  | 'PARTNER'
  | 'GENERAL';

export interface DataUrlModel {
  id: string;
  url: string;
  type: DataUrlType;
}
