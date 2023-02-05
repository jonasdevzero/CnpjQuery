import { Controller, HttpRequest } from '@presentation/protocols';
import { FastifyReply, FastifyRequest } from 'fastify';

export const adaptRoute = (controller: Controller) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params as { [key: string]: string },
    };

    const httpResponse = await controller.handle(httpRequest);

    reply.status(httpResponse.statusCode);
    reply.send(httpResponse.body);
  };
};
