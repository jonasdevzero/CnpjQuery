import { QueryCnpj } from '../../domain/useCases/QueryCnpj';
import { ListDataUrlRepository } from '../protocols/ListDataUrlRepository';

export class DbQueryCnpj implements QueryCnpj {
  private readonly listDataUrlRepository: ListDataUrlRepository;

  constructor(listDataUrlRepository: ListDataUrlRepository) {
    this.listDataUrlRepository = listDataUrlRepository;
  }

  async query(): Promise<void> {
    await this.listDataUrlRepository.list();
  }
}
