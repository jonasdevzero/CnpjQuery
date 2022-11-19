import { QueryCnpjController } from './QueryCnpj';

describe('QueryCnpj Controller', () => {
  test('Should return 200 if success', () => {
    const sut = new QueryCnpjController();

    const httpResponse = sut.handle({});

    expect(httpResponse.statusCode).toBe(200);
  });
});
