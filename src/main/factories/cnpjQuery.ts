import { DbQueryCnpj } from '../../data/useCases/DbQueryCnpj';
import { ListDataUrlPostgresRepository } from '../../infra/db/postgres/repositories/dataUrl/ListDataUrlPostgresRepository';
import { UpsertCompanyPostgresRepository } from '../../infra/db/postgres/repositories/company/UpsertCompanyPostgresRepository';
import { UpsertEstablishmentPostgresRepository } from '../../infra/db/postgres/repositories/establishment/UpsertEstablishmentPostgresRepository';
import { UpsertSimplesPostgresRepository } from '../../infra/db/postgres/repositories/simples/UpsertSimplesPostgresRepository';
import { QueryCnpjController } from '../../presentation/controllers/QueryCnpj';
import { Controller } from '../../presentation/protocols';
import { CnpjRawDataParserAdapter } from '../../utils/CnpjRawDataParserAdapter';
import { ZippedCsvReaderAdapter } from '../../utils/ZippedCsvReaderAdapter';
import { UpsertPartnerPostgresRepository } from '../../infra/db/postgres/repositories/partner/UpsertPartnerPostgresRepository';
import { UpsertCountryPostgresRepository } from '../../infra/db/postgres/repositories/country/UpsertCountryPostgresRepository';
import { UpsertCityPostgresRepository } from '../../infra/db/postgres/repositories/city/UpsertCityPostgresRepository';
import { UpsertQualificationPostgresRepository } from '../../infra/db/postgres/repositories/qualification/UpsertQualificationPostgresRepository';
import { UpsertLegalNaturePostgresRepository } from '../../infra/db/postgres/repositories/legalNature/UpsertLegalNaturePostgresRepository';
import { UpsertCnaePostgresRepository } from '../../infra/db/postgres/repositories/cnae/UpsertCnaePostgresRepository';
import { UpsertReasonPostgresRepository } from '../../infra/db/postgres/repositories/reason/UpsertReasonPostgresRepository';

export const makeCnpjQueryController = (): Controller => {
  const listDataUrlRepository = new ListDataUrlPostgresRepository();
  const zipLoaderAdapter = new ZippedCsvReaderAdapter();
  const upsertCompanyRepository = new UpsertCompanyPostgresRepository();
  const upsertEstablishmentRepository = new UpsertEstablishmentPostgresRepository();
  const upsertSimplesRepository = new UpsertSimplesPostgresRepository();
  const cnpjRawDataParserAdapter = new CnpjRawDataParserAdapter();
  const upsertPartnerRepository = new UpsertPartnerPostgresRepository();
  const upsertCountryRepository = new UpsertCountryPostgresRepository();
  const upsertCityRepository = new UpsertCityPostgresRepository();
  const upsertQualificationRepository = new UpsertQualificationPostgresRepository();
  const upsertLegalNatureRepository = new UpsertLegalNaturePostgresRepository();
  const upsertCnaeRepository = new UpsertCnaePostgresRepository();
  const upsertReasonRepository = new UpsertReasonPostgresRepository();

  const queryCnpj = new DbQueryCnpj(
    listDataUrlRepository,
    zipLoaderAdapter,
    upsertCompanyRepository,
    upsertEstablishmentRepository,
    upsertSimplesRepository,
    cnpjRawDataParserAdapter,
    upsertPartnerRepository,
    upsertCountryRepository,
    upsertCityRepository,
    upsertQualificationRepository,
    upsertLegalNatureRepository,
    upsertCnaeRepository,
    upsertReasonRepository,
  );

  const signUpController = new QueryCnpjController(queryCnpj);

  return signUpController;
};
