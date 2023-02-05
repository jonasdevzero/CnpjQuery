import { AppError } from './AppError';

export class InvalidParamError extends AppError {
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`, 400);
    this.name = 'InvalidParamError';
  }
}
