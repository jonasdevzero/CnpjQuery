import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { CnpjValidator } from '../../../domain/utils/CnpjValidator';
import { MissingParamError } from '../../errors/MissingParamError';
import { badRequest, ok, serverError } from '../../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class FindCnpjController implements Controller {
  private readonly findOneCnpj: FindCnpj;
  private readonly cnpjValidator: CnpjValidator;

  constructor(findOneCnpj: FindCnpj, cnpjValidator: CnpjValidator) {
    this.findOneCnpj = findOneCnpj;
    this.cnpjValidator = cnpjValidator;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { cnpj } = request.params;

      if (!cnpj) {
        return badRequest(new MissingParamError('cnpj'));
      }

      this.cnpjValidator.isValid(cnpj);

      await this.findOneCnpj.find(cnpj);

      return ok();
    } catch (error) {
      return serverError(error);
    }
  }
}
