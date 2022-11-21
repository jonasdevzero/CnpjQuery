import { ServerError } from '../errors/ServerError';
import { HttpResponse } from '../protocols/Http';

export const ok = (data?: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack),
  };
};
