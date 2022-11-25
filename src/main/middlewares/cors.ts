import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export const cors = (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  reply.header('access-control-allow-origin', '*');
  reply.header('access-control-allow-methods', '*');
  reply.header('access-control-allow-headers', '*');
  done();
};
