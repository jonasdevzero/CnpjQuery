import { CacheIoRedis } from '@infra/cache/ioredis/client';
import { DbFindCnpj } from '@data/useCases/DbFindCnpj/DbFindCnpj';
import { FindCnpjPostgresRepository } from '@infra/db/postgres/repositories/cnpj/FindCnpjPostgresRepository';
import { FindCnpjController } from '@presentation/controllers/FindCnpj/FindCnpj';
import { Controller } from '@presentation/protocols';
import { CnpjValidatorRegexAdapter } from '@utils/CnpjValidatorRegexAdapter';

export const makeFindCnpjController = (): Controller => {
  const cache = new CacheIoRedis();
  const findCnpjRepository = new FindCnpjPostgresRepository(cache);
  const findCnpj = new DbFindCnpj(findCnpjRepository);

  const cnpjValidator = new CnpjValidatorRegexAdapter();

  const findCnpjController = new FindCnpjController(findCnpj, cnpjValidator);

  return findCnpjController;
};
