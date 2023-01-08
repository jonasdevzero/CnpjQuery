import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import { adaptRoute } from '../adapters/fastifyRoutesAdapter';
import { makeFindCnpjController } from '../factories/findCnpj';

export const config = {
  prefix: '/cnpj',
};

export const routes = (app: FastifyInstance, _opts: Object, done: HookHandlerDoneFunction) => {
  app.get('/:cnpj', adaptRoute(makeFindCnpjController()));

  done();
};
