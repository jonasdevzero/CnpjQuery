import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { FindCnpjRepository } from '../../protocols/FindCnpjRepository';

export class DbFindCnpj implements FindCnpj {
  private readonly findCnpjRepository: FindCnpjRepository;

  constructor(findCnpjRepository: FindCnpjRepository) {
    this.findCnpjRepository = findCnpjRepository;
  }

  async find(cnpj: string): Promise<string | null> {
    const result = await this.findCnpjRepository.find(cnpj);
    return result;
  }
}
