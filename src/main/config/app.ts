import fastify from 'fastify';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';

const app = fastify();

setupMiddlewares(app);
setupRoutes(app);

export default app;
