import { DbQueryCnpj } from '../../data/useCases/DbQueryCnpj';
import { ListDataUrlPostgresRepository } from '../../infra/db/postgres/repositories/dataUrl/ListDataUrlPostgresRepository';
import { UpsertCompanyPostgresRepository } from '../../infra/db/postgres/repositories/company/UpsertCompanyPostgresRepository';
import { UpsertEstablishmentPostgresRepository } from '../../infra/db/postgres/repositories/establishment/UpsertEstablishmentPostgresRepository';
import { UpsertSimplesPostgresRepository } from '../../infra/db/postgres/repositories/simples/UpsertSimplesPostgresRepository';
import { QueryCnpjController } from '../../presentation/controllers/QueryCnpj';
import { Controller } from '../../presentation/protocols';
import { CnpjRawDataParserAdapter } from '../../utils/CnpjRawDataParserAdapter';
import { ZippedCsvReaderAdapter } from '../../utils/ZippedCsvReaderAdapter';

export const makeCnpjQueryController = (): Controller => {
  const listDataUrlRepository = new ListDataUrlPostgresRepository();
  const zipLoaderAdapter = new ZippedCsvReaderAdapter();
  const upsertCompanyRepository = new UpsertCompanyPostgresRepository();
  const upsertEstablishmentRepository = new UpsertEstablishmentPostgresRepository();
  const upsertSimplesRepository = new UpsertSimplesPostgresRepository();
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
