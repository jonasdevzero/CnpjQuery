import { Inject, Injectable } from '@container';
import { FindCnpjRepository } from '@data/protocols';
import { FindCnpj } from '@domain/use-cases/FindCnpj';

@Injectable()
export class DbFindCnpj implements FindCnpj {
  constructor(
    @Inject('FindCnpjRepository')
    private findCnpjRepository: FindCnpjRepository,
  ) {}

  async find(cnpj: string): Promise<string | null> {
    const result = await this.findCnpjRepository.find(cnpj);
    return result;
  }
}
