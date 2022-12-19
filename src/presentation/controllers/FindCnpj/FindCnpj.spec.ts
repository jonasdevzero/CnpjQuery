import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { badRequest, serverError } from '../../helpers/httpHelper';
import { FindCnpjController } from './FindCnpj';
import { MissingParamError } from '../../errors/MissingParamError';

const makeFakeFindCnpj = (): FindCnpj => {
  class FindCnpjStub implements FindCnpj {
    async find(cnpj: string): Promise<CnpjModel | null> {
      throw new Error();
    }
  }

  return new FindCnpjStub();
};

interface SutTypes {
  sut: FindCnpjController;
  findCnpjStub: FindCnpj;
}

const makeSut = (): SutTypes => {
  const findCnpjStub = makeFakeFindCnpj();
  const sut = new FindCnpjController(findCnpjStub);

  return { sut, findCnpjStub };
};

describe('FindCnpj Controller', () => {
  test('Should return 400 if cnpj was not provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ params: {} });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('cnpj')));
  });

  test('Should return 500 if FindCnpj throws', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
