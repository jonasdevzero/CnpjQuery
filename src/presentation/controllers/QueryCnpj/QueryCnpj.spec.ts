import { HttpRequest, QueryCnpj } from './QueryCnpj.protocols';
import { serverError } from '../../helpers/httpHelper';
import { QueryCnpjController } from './QueryCnpj';

const makeFakeQueryCnpj = (): QueryCnpj => {
  class QueryCnpjStub implements QueryCnpj {
    async query(): Promise<void> {
      // ...
    }
  }

  return new QueryCnpjStub();
};

const makeFakeRequest = (): HttpRequest => {
  return { params: {} };
};

interface SutTypes {
  sut: QueryCnpjController;
  queryCnpjStub: QueryCnpj;
}

const makeSut = (): SutTypes => {
  const queryCnpjStub = makeFakeQueryCnpj();
  const sut = new QueryCnpjController(queryCnpjStub);

  return {
    sut,
    queryCnpjStub,
  };
};

describe('QueryCnpj Controller', () => {
  test('Should return 200 if success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse.statusCode).toBe(200);
  });

  test('Should return 500 if QueryCnpj Model throws', async () => {
    const { sut, queryCnpjStub } = makeSut();

    jest.spyOn(queryCnpjStub, 'query').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});