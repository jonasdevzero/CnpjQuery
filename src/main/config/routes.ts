import { FastifyInstance } from 'fastify';
import { FilesFinderAdapter } from '../../utils/FilesFinderAdapter';

export default async (app: FastifyInstance) => {
  const filesFinderAdapter = new FilesFinderAdapter();
  const files = filesFinderAdapter.find('src/main/routes', '*.routes.ts');

  await Promise.all(
    files.map(async (file) => {
      const { routes, config } = await import(file);

      app.register(routes, config);
    }),
  );
};
