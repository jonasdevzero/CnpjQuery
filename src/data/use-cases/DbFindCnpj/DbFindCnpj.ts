import { inject, injectable } from '@container';
import { FindCnpjRepository } from '@data/protocols';
import { FindCnpj } from '@domain/use-cases/FindCnpj';
import { NotFoundError } from '@presentation/errors';

@injectable()
export class DbFindCnpj implements FindCnpj {
  constructor(
    @inject('FindCnpjRepository')
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
