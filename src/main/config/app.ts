import fastify from 'fastify';
import setupMiddlewares from './middlewares';

const app = fastify();

setupMiddlewares(app);

export default app;
