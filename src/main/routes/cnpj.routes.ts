import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import { adaptRoute } from '../adapters/fastifyRoutesAdapter';
import { makeCnpjQueryController } from '../factories/cnpjQuery';

export const config = {
  prefix: '/cnpj',
};

export const routes = (app: FastifyInstance, _opts: Object, done: HookHandlerDoneFunction) => {
  app.post('/query', adaptRoute(makeCnpjQueryController()));

  done();
};
