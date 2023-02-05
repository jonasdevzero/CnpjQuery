import { container } from '@container';
import { FindCnpjController } from '@presentation/controllers/FindCnpj/FindCnpj';
import { Controller } from '@presentation/protocols';

export const makeFindCnpjController = (): Controller => {
  return container.resolve(FindCnpjController);
};
