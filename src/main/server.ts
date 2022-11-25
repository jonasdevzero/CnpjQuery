import fastify from 'fastify';

const app = fastify();

app.listen(4000, () => console.log('Server running at http://localhost:4000'));
