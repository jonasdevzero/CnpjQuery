import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, HttpRequest } from '../../presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: {},
    };

    const httpResponse = await controller.handle(httpRequest);
    reply.status(httpResponse.statusCode);

    if (httpResponse.statusCode >= 400) {
      const error = httpResponse.body as Error;
      reply.send({ error: error.message });
      return;
    }

    reply.send(httpResponse.body);
  };
};
