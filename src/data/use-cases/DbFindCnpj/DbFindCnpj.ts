import { Inject, Injectable } from '@container';
import { FindCnpjRepository } from '@data/protocols';
import { FindCnpj } from '@domain/use-cases/FindCnpj';
import { NotFoundError } from '@presentation/errors';

@Injectable()
export class DbFindCnpj implements FindCnpj {
  constructor(
    @Inject('FindCnpjRepository')
    private findCnpjRepository: FindCnpjRepository,
  ) {}

  async find(cnpj: string): Promise<string> {
    const result = await this.findCnpjRepository.find(cnpj);

    if (!result) {
      throw new NotFoundError('cnpj');
    }

    return result;
  }
}
