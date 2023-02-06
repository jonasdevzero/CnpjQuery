import { HttpResponse } from '../protocols';

export const ok = (data?: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: { error: 'Internal Server Error' },
  };
};
