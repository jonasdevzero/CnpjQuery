import { inject, injectable } from '@container';
import { controller } from '@presentation/decorators';
import { InvalidParamError } from '../../errors';
import { ok } from '../../helpers/httpHelper';
import {
  CnpjValidator,
  Controller,
  FindCnpj,
  HttpRequest,
  HttpResponse,
} from './FindCnpj.protocols';

@controller()
@injectable()
export class FindCnpjController implements Controller {
  constructor(
    @inject('FindCnpj')
    private findCnpj: FindCnpj,

    @inject('CnpjValidator')
    private cnpjValidator: CnpjValidator,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { cnpj } = request.params;

    const isCnpjValid = this.cnpjValidator.isValid(cnpj);

    if (!isCnpjValid) {
      throw new InvalidParamError('cnpj');
    }

    const cnpjModel = await this.findCnpj.find(cnpj);

    return ok(cnpjModel);
  }
}
