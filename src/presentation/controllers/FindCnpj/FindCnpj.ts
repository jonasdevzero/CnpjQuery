import { Inject, Injectable } from '@container';
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

@Injectable()
export class FindCnpjController implements Controller {
  constructor(
    @Inject('FindCnpj')
    private findCnpj: FindCnpj,

    @Inject('CnpjValidator')
    private cnpjValidator: CnpjValidator,
  ) {}

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
