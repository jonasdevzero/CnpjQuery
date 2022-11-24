import { DataUrlType } from '@prisma/client';
import { prismaMock } from '../clientMock';
import { ListDataUrlPrismaRepository } from './ListDataUrlPrismaRepository';

const makeSut = (): ListDataUrlPrismaRepository => {
  return new ListDataUrlPrismaRepository();
};

describe('ListDataUrlPrismaRepository', () => {
  test('Should return data urls on success', async () => {
    const sut = makeSut();

    const date = new Date();
    const dataUrl = {
      id: 'any_id',
      url: 'http://any_url.zip',
      type: 'COMPANY' as DataUrlType,
      createdAt: date,
      updatedAt: date,
    };

    prismaMock.dataUrl.findMany.mockResolvedValueOnce([dataUrl]);

    const urls = await sut.list();

    expect(urls).toEqual([dataUrl]);
  });

  test('Should throw if prisma throws', async () => {
    const sut = makeSut();

    prismaMock.dataUrl.findMany.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.list()).rejects.toThrow(new Error());
  });
});
