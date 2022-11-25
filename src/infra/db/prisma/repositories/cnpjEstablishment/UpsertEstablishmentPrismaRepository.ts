import { UpsertEstablishmentRepository } from '../../../../../data/protocols/UpsertEstablishmentRepository';
import { UpsertEstablishmentModel } from '../../../../../domain/models/Establishment';
import prisma from '../../client';

export class UpsertEstablishmentPrismaRepository implements UpsertEstablishmentRepository {
  async upsert(data: UpsertEstablishmentModel): Promise<void> {
    const { baseCnpj } = data;
    const { cnpj, address, ...establishmentData } = data;

    await prisma.cnpj.upsert({
      where: { baseCnpj },
      update: { cnpj },
      create: { cnpj, baseCnpj: data.baseCnpj },
    });

    await prisma.cnpjEstablishment.upsert({
      where: { baseCnpj: data.baseCnpj },
      update: {
        ...establishmentData,
        address: { update: address },
      },
      create: {
        ...establishmentData,
        address: { create: address },
      },
    });
  }
}
