import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { ok, serverError } from '../../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class FindCnpjController implements Controller {
  private readonly findOneCnpj: FindCnpj;

  constructor(findOneCnpj: FindCnpj) {
    this.findOneCnpj = findOneCnpj;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { cnpj } = request.params;

      await this.findOneCnpj.find(cnpj);

      return ok();
    } catch (error) {
      return serverError(error);
    }
  }
}
