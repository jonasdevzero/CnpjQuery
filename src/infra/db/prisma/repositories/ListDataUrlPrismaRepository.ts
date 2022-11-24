import { ListDataUrlRepository } from '../../../../data/protocols/ListDataUrlRepository';
import { DataUrlModel } from '../../../../domain/models/DataUrl';
import prisma from '../client';

export class ListDataUrlPrismaRepository implements ListDataUrlRepository {
  async list(): Promise<DataUrlModel[]> {
    const dataUrls = await prisma.dataUrl.findMany();
    return dataUrls;
  }
}
