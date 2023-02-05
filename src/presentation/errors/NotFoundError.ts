import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(paramName: string) {
    super(`${paramName} not found`, 404);
  }
}
