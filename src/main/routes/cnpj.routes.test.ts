import request from 'supertest';
import app from '../config/app';

describe('CnpjQuery Routes', () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  test('Should return 200 if success', async () => {
    await request(app.server).post('/cnpj/query').expect(200);
  });
});
