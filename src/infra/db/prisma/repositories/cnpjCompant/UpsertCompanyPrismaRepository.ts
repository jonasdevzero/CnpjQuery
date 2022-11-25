import { UpsertCompanyRepository } from '../../../../../data/protocols/UpsertCompanyRepository';
import { UpsertCompanyModel } from '../../../../../domain/models/Company';
import prisma from '../../client';

export class UpsertCompanyPrismaRepository implements UpsertCompanyRepository {
  async upsert(data: UpsertCompanyModel): Promise<void> {
    await prisma.cnpjCompany.upsert({
      where: { baseCnpj: data.baseCnpj },
      update: data,
      create: data,
    });
  }
}
