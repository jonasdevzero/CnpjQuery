import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export const cache = (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  reply.header('cache-control', 'public,max-age=43200');
  done();
};
