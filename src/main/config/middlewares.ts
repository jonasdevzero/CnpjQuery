import type { FastifyInstance } from 'fastify';
import { cors } from '../middlewares/cors';
import { cache } from '../middlewares/cache';

export default (app: FastifyInstance) => {
  app.addHook('preHandler', cors);
  app.addHook('preHandler', cache);
};
