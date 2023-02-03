import { DbFindCnpj } from './DbFindCnpj';
import { FindCnpjRepository } from '../../protocols/FindCnpjRepository';

const makeFakeFindCnpjRepository = (): FindCnpjRepository => {
  class FindCnpjRepositoryStub implements FindCnpjRepository {
    async find(cnpj: string): Promise<string | null> {
      return ' ';
    }
  }

  return new FindCnpjRepositoryStub();
};

interface SutTypes {
  sut: DbFindCnpj;
  findCnpjRepositoryStub: FindCnpjRepository;
}

const makeSut = (): SutTypes => {
  const findCnpjRepositoryStub = makeFakeFindCnpjRepository();
  const sut = new DbFindCnpj(findCnpjRepositoryStub);

  return { sut, findCnpjRepositoryStub };
};

describe('DbFindCnpj', () => {
  test('Should throw if FindCnpjRepository throws', async () => {
    const { sut, findCnpjRepositoryStub } = makeSut();

    jest.spyOn(findCnpjRepositoryStub, 'find').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.find('any_cnpj')).rejects.toThrow();
  });

  test('Should call FindCnpjRepository with correct value', async () => {
    const { sut, findCnpjRepositoryStub } = makeSut();

    const findCnpjRepositorySpy = jest.spyOn(findCnpjRepositoryStub, 'find');

    await sut.find('any_cnpj');

    expect(findCnpjRepositorySpy).toHaveBeenCalledWith('any_cnpj');
  });

  test('Should return correct value if success', async () => {
    const { sut } = makeSut();

    const result = await sut.find('any_cnpj');

    expect(result).toEqual({});
  });
});
