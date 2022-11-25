import { UpsertCompanyRepository } from '../../../../../data/protocols/UpsertCompanyRepository';
import { UpsertCompanyModel } from '../../../../../domain/models/Company';
import prisma from '../../client';

export class UpsertCompanyPrismaRepository implements UpsertCompanyRepository {
  async upsert(data: UpsertCompanyModel): Promise<void> {
    const { baseCnpj } = data;

    await prisma.cnpj.upsert({
      where: { baseCnpj },
      update: {},
      create: { baseCnpj },
    });

    await prisma.cnpjCompany.upsert({
      where: { baseCnpj },
      update: data,
      create: data,
    });
  }
}
