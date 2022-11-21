import { QueryCnpj } from '../../domain/useCases/QueryCnpj';
import { ok, serverError } from '../helpers/httpHelper';
import { Controller } from '../protocols/Controller';
import { HttpRequest, HttpResponse } from '../protocols/Http';

export class QueryCnpjController implements Controller {
  private readonly queryCnpj: QueryCnpj;

  constructor(queryCnpj: QueryCnpj) {
    this.queryCnpj = queryCnpj;
  }

  async handle(_request: HttpRequest): Promise<HttpResponse> {
    try {
      await this.queryCnpj.query();

      return ok();
    } catch (error) {
      return serverError(error);
    }
  }
}
