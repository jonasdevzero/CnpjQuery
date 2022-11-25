import request from 'supertest';
import app from '../config/app';

describe('CORS Plugin', () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  test('Should enable CORS', async () => {
    app.get('/test_cors', (req, reply) => reply.send());

    await request(app.server)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
