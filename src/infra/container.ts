import { container } from '@container';
import { Cache, FindCnpjRepository } from '@data/protocols';
import { CacheIoRedis } from '@infra/cache/ioredis/client';
import { FindCnpjPostgresRepository } from './db/postgres/repositories';

container.register<Cache>('Cache', CacheIoRedis);

container.register<FindCnpjRepository>('FindCnpjRepository', FindCnpjPostgresRepository);
