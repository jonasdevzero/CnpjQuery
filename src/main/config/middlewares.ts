import type { FastifyInstance } from 'fastify';
import { cors } from '../middlewares/cors';

export default (app: FastifyInstance) => {
  app.addHook('preHandler', cors);
};
