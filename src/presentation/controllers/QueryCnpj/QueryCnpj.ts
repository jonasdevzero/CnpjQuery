import { ok, serverError } from '../../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse, QueryCnpj } from './QueryCnpj.protocols';

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
