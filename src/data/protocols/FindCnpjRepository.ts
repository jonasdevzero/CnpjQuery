import { CnpjModel } from '../../domain/models/Cnpj';

export interface FindCnpjRepository {
  find(cnpj: string): Promise<CnpjModel | null>;
}
