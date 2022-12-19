import { CnpjModel } from '../../../domain/models/Cnpj';
import { FindCnpj } from '../../../domain/useCases/FindCnpj';
import { badRequest, serverError } from '../../helpers/httpHelper';
import { FindCnpjController } from './FindCnpj';
import { MissingParamError } from '../../errors/MissingParamError';
import { InvalidParamError } from '../../errors/InvalidParamError';
import { CnpjValidator } from '../../../domain/utils/CnpjValidator';

const makeFakeFindCnpj = (): FindCnpj => {
  class FindCnpjStub implements FindCnpj {
    async find(cnpj: string): Promise<CnpjModel | null> {
      throw new Error();
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
  test('Should return 400 if cnpj was not provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ params: {} });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('cnpj')));
  });

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

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('cnpj')));
  });

  test('Should return 500 if FindCnpj throws', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ params: { cnpj: 'any_cnpj' } });

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
