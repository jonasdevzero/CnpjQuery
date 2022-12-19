import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { serverError } from '../../helpers/httpHelper';
import { FindCnpjController } from './FindCnpj';

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
  test('Should return 500 if FindCnpj throws', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ params: {} });

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
