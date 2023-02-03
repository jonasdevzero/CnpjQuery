import { FastifyInstance } from 'fastify';
import fastifyCaching from '@fastify/caching';
import fastifyRedis from '@fastify/redis';
import AbstractCache from 'abstract-cache';
import { ioredis } from 'infra/cache/ioredis/client';

export default (app: FastifyInstance) => {
  if (!ioredis) {
    app.register(fastifyCaching, { privacy: fastifyCaching.privacy.NOCACHE });
  } else {
    const abstractCache = AbstractCache({
      useAwait: false,
      driver: {
        name: 'abstract-cache-redis',
        options: { client: ioredis },
      },
    });

    app.register(fastifyRedis, { client: ioredis });

    app.register(fastifyCaching, {
      privacy: fastifyCaching.privacy.PUBLIC,
      expiresIn: 60 * 60 * 12,
      cache: abstractCache,
    });
  }
};
