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
  private readonly findCnpj: FindCnpj;
  private readonly cnpjValidator: CnpjValidator;

  constructor(findCnpj: FindCnpj, cnpjValidator: CnpjValidator) {
    this.findCnpj = findCnpj;
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

      const cnpjModel = await this.findCnpj.find(cnpj);

      if (!cnpjModel) {
        return notFound();
      }

      return ok(cnpjModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
