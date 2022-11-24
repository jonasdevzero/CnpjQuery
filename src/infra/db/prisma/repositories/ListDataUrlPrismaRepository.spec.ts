import { DataUrlType } from '@prisma/client';
import { prismaMock } from '../client-mock';
import { ListDataUrlPrismaRepository } from './ListDataUrlPrismaRepository';

describe('ListDataUrlPrismaRepository', () => {
  test('Should return data urls on success', async () => {
    const sut = new ListDataUrlPrismaRepository();

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
});
