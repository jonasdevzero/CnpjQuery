import { DbQueryCnpj } from '../../data/useCases/DbQueryCnpj';
import { UpsertCompanyPrismaRepository } from '../../infra/db/prisma/repositories/cnpjCompany/UpsertCompanyPrismaRepository';
import { UpsertEstablishmentPrismaRepository } from '../../infra/db/prisma/repositories/cnpjEstablishment/UpsertEstablishmentPrismaRepository';
import { UpsertSimplesPrismaRepository } from '../../infra/db/prisma/repositories/cnpjSimples/UpsertSimplesPrismaRepository';
import { ListDataUrlPrismaRepository } from '../../infra/db/prisma/repositories/dataUrl/ListDataUrlPrismaRepository';
import { QueryCnpjController } from '../../presentation/controllers/QueryCnpj';
import { Controller } from '../../presentation/protocols';
import { CnpjRawDataParserAdapter } from '../../utils/CnpjRawDataParserAdapter';
import { ZippedCsvReaderAdapter } from '../../utils/ZippedCsvReaderAdapter';

export const makeCnpjQueryController = (): Controller => {
  const listDataUrlRepository = new ListDataUrlPrismaRepository();
  const zipLoaderAdapter = new ZippedCsvReaderAdapter();
  const upsertCompanyRepository = new UpsertCompanyPrismaRepository();
  const upsertEstablishmentRepository = new UpsertEstablishmentPrismaRepository();
  const upsertSimplesRepository = new UpsertSimplesPrismaRepository();
  const cnpjRawDataParserAdapter = new CnpjRawDataParserAdapter();

  const queryCnpj = new DbQueryCnpj(
    listDataUrlRepository,
    zipLoaderAdapter,
    upsertCompanyRepository,
    upsertEstablishmentRepository,
    upsertSimplesRepository,
    cnpjRawDataParserAdapter,
  );

  const signUpController = new QueryCnpjController(queryCnpj);

  return signUpController;
};
