import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { serverError } from '../../helpers/httpHelper';
import { FindCnpjController } from './FindCnpj';

describe('FindCnpj Controller', () => {
  test('Should return 500 if FindCnpj throws', async () => {
    class FindOneCnpjStub implements FindCnpj {
      async find(cnpj: string): Promise<CnpjModel | null> {
        throw new Error();
      }
    }

    const findOneCnpjStub = new FindOneCnpjStub();
    const sut = new FindCnpjController(findOneCnpjStub);

    const httpResponse = await sut.handle({ params: {} });

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
