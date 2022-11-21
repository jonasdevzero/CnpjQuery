import { QueryCnpj } from '../../domain/useCases/queryCnpj';
import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class QueryCnpjController implements Controller {
  private readonly queryCnpj: QueryCnpj;

  constructor(queryCnpj: QueryCnpj) {
    this.queryCnpj = queryCnpj;
  }

  async handle(_request: HttpRequest): Promise<HttpResponse> {
    try {
      await this.queryCnpj.query();

      return {
        statusCode: 200,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: error,
      };
    }
  }
}
