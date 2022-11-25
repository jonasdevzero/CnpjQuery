import { UpsertSimplesRepository } from '../../../../../data/protocols/UpsertSimplesRepository';
import { UpsertSimplesModel } from '../../../../../domain/models/Simples';
import prisma from '../../client';

export class UpsertSimplesPrismaRepository implements UpsertSimplesRepository {
  async upsert(data: UpsertSimplesModel): Promise<void> {
    const { baseCnpj } = data;

    await prisma.cnpj.upsert({
      where: { baseCnpj },
      create: { baseCnpj },
      update: {},
    });

    await prisma.cnpjSimples.upsert({
      where: { baseCnpj },
      update: data,
      create: data,
    });
  }
}
