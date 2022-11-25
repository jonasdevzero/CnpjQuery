import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';

export const config = {
  prefix: '/cnpj',
};

export const routes = (app: FastifyInstance, _opts: Object, done: HookHandlerDoneFunction) => {
  app.post('/query', (req, reply) => {
    reply.send({ message: 'ok' });
  });

  done();
};
