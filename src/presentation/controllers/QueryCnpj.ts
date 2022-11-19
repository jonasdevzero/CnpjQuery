import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class QueryCnpjController implements Controller {
  handle(request: HttpRequest): HttpResponse {
    return {
      statusCode: 200,
    };
  }
}
