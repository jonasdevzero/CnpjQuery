import { AppError } from '@presentation/errors/AppError';
import { serverError } from '@presentation/helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';

type ControllerClass<T = Controller> = { new (...args: any[]): T };

export function controller() {
  return function decorator<T extends ControllerClass>(constructor: T): T | void {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
      }

      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        let httpResponse: HttpResponse;

        try {
          httpResponse = await super.handle(httpRequest);
        } catch (error) {
          httpResponse = error instanceof AppError ? error.makeResponse() : serverError(error);
        }

        return httpResponse;
      }
    };
  };
}
