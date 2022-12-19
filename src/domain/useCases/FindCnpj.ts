import { CnpjModel } from '../models/Cnpj';

export interface FindCnpj {
  find(cnpj: string): Promise<CnpjModel | null>;
}
