import fastify from 'fastify';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import setupCache from './cache';

const app = fastify();

setupMiddlewares(app);
setupRoutes(app);
setupCache(app);

export default app;
