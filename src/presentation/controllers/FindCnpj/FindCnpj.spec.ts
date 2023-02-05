import { InvalidParamError, NotFoundError } from '@presentation/errors';
import { ok, serverError } from '../../helpers/httpHelper';
import { FindCnpjController } from './FindCnpj';
import { CnpjValidator, FindCnpj } from './FindCnpj.protocols';

const makeFakeFindCnpj = (): FindCnpj => {
  class FindCnpjStub implements FindCnpj {
    async find(cnpj: string): Promise<string> {
      return 'any_cnpj_json';
    }
  }

  return new FindCnpjStub();
};

const makeFakeCnpjValidator = (): CnpjValidator => {
  class CnpjValidatorStub implements CnpjValidator {
    isValid(cnpj: string): boolean {
      return true;
    }
  }

  return new CnpjValidatorStub();
};

interface SutTypes {
  sut: FindCnpjController;
  findCnpjStub: FindCnpj;
  cnpjValidator: CnpjValidator;
}

const makeSut = (): SutTypes => {
  const findCnpjStub = makeFakeFindCnpj();
  const cnpjValidator = makeFakeCnpjValidator();

  const sut = new FindCnpjController(findCnpjStub, cnpjValidator);

  return { sut, findCnpjStub, cnpjValidator };
};

describe('FindCnpj Controller', () => {
  test('Should return 500 if CnpjValidator throws', async () => {
    const { sut, cnpjValidator } = makeSut();

    jest.spyOn(cnpjValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 400 if an invalid cnpj was provided', async () => {
    const { sut, cnpjValidator } = makeSut();

    jest.spyOn(cnpjValidator, 'isValid').mockImplementationOnce(() => false);

    const httpResponse = await sut.handle({ params: { cnpj: 'invalid_cnpj' } });

    expect(httpResponse).toEqual(new InvalidParamError('cnpj').makeResponse());
  });

  test('Should call CnpjValidator with correct param', async () => {
    const { sut, cnpjValidator } = makeSut();

    const cnpjValidatorSpy = jest.spyOn(cnpjValidator, 'isValid');

    await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(cnpjValidatorSpy).toHaveBeenCalledWith('any_cnpj');
  });

  test('Should return 500 if FindCnpj throws', async () => {
    const { sut, findCnpjStub } = makeSut();

    jest.spyOn(findCnpjStub, 'find').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call FindCnpj with correct param', async () => {
    const { sut, findCnpjStub } = makeSut();

    const findCnpjSpy = jest.spyOn(findCnpjStub, 'find');

    await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(findCnpjSpy).toHaveBeenCalledWith('any_cnpj');
  });

  test('Should throw if cnpj was not found', async () => {
    const { sut, findCnpjStub } = makeSut();

    jest.spyOn(findCnpjStub, 'find').mockImplementationOnce(async () => {
      throw new NotFoundError('cnpj');
    });

    const httpResponse = await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(httpResponse).toEqual(new NotFoundError('cnpj').makeResponse());
  });

  test('Should return 200 if success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(httpResponse).toEqual(ok('any_cnpj_json'));
  });
});
