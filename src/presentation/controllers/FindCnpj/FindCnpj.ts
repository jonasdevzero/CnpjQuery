import { badRequest, notFound, ok, serverError } from '../../helpers/httpHelper';
import { InvalidParamError } from '../../errors/InvalidParamError';
import { MissingParamError } from '../../errors/MissingParamError';
import {
  CnpjValidator,
  Controller,
  FindCnpj,
  HttpRequest,
  HttpResponse,
} from './FindCnpj.protocols';

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

      const isCnpjValid = this.cnpjValidator.isValid(cnpj);

      if (!isCnpjValid) {
        return badRequest(new InvalidParamError('cnpj'));
      }

      const cnpjModel = await this.findOneCnpj.find(cnpj);

      if (!cnpjModel) {
        return notFound();
      }

      return ok(cnpjModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
