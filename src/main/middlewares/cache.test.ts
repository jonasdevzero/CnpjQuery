import { ioredis } from '@infra/cache/ioredis/client';
import app from '@main/config/app';
import request from 'supertest';

describe('Cache middleware', () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
    ioredis?.disconnect();
  });

  test('Should enable cache', async () => {
    app.get('/test_cache', (req, reply) => reply.send());

    await request(app.server).get('/test_cache').expect('cache-control', 'public,max-age=43200');
  });
});
