import { dbMock } from '../../dbMock';
import { ListDataUrlPostgresRepository } from './ListDataUrlPostgresRepository';

const makeSut = (): ListDataUrlPostgresRepository => {
  return new ListDataUrlPostgresRepository();
};

describe('ListDataUrlPostgresRepository', () => {
  test('Should throw if postgres throws', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.list()).rejects.toThrow();
  });

  test('Should return correct values on success', async () => {
    const sut = makeSut();

    dbMock.mockImplementationOnce(() => {
      return [
        {
          id: 'any_id_4',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'PARTNER',
        },
        {
          id: 'any_id_2',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'ESTABLISHMENT',
        },
        {
          id: 'any_id_1',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'COMPANY',
        },
        {
          id: 'any_id_4',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'NATURES',
        },
        {
          id: 'any_id_3',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'SIMPLES',
        },
        {
          id: 'any_id_10',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'COMPANY',
        },
        {
          id: 'any_id_4',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'COUNTRIES',
        },
        {
          id: 'any_id_4',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'CNAE',
        },
        {
          id: 'any_id_4',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'REASONS',
        },
        {
          id: 'any_id_4',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'QUALIFICATIONS',
        },
        {
          id: 'any_id_4',
          url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
          type: 'CITIES',
        },
      ];
    });

    const result = await sut.list();

    expect(result).toEqual([
      {
        id: 'any_id_4',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'COUNTRIES',
      },
      {
        id: 'any_id_4',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'CITIES',
      },
      {
        id: 'any_id_4',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'CNAE',
      },
      {
        id: 'any_id_4',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'REASONS',
      },
      {
        id: 'any_id_4',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'NATURES',
      },
      {
        id: 'any_id_4',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'QUALIFICATIONS',
      },
      {
        id: 'any_id_1',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'COMPANY',
      },
      {
        id: 'any_id_10',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'COMPANY',
      },
      {
        id: 'any_id_2',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'ESTABLISHMENT',
      },
      {
        id: 'any_id_3',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'SIMPLES',
      },
      {
        id: 'any_id_4',
        url: 'http://200.152.38.155/CNPJ/Empresas0.zip',
        type: 'PARTNER',
      },
    ]);
  });
});
