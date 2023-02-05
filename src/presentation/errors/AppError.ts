import { HttpResponse } from '@presentation/protocols';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  makeResponse(): HttpResponse {
    return {
      statusCode: this.statusCode,
      body: { error: this.message },
    };
  }
}
