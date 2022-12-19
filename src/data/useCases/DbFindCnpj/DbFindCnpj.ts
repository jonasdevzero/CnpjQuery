import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { FindCnpjRepository } from '../../protocols/FindCnpjRepository';

export class DbFindCnpj implements FindCnpj {
  private readonly findCnpjRepository: FindCnpjRepository;

  constructor(findCnpjRepository: FindCnpjRepository) {
    this.findCnpjRepository = findCnpjRepository;
  }

  async find(cnpj: string): Promise<CnpjModel | null> {
    await this.findCnpjRepository.find(cnpj);
    return null;
  }
}
