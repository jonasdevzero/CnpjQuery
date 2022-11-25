import { FastifyInstance } from 'fastify';
import { GetRoutesFiles } from '../helpers/GetRoutesFiles';

export default async (app: FastifyInstance) => {
  const files = GetRoutesFiles.get();

  await Promise.all(
    files.map(async (file) => {
      const { routes, config } = await import(file);

      app.register(routes, config);
    }),
  );
};
