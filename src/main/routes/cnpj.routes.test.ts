import request from 'supertest';
import app from '../config/app';
import { dbMock } from '../../infra/db/postgres/dbMock';

describe('CnpjQuery Routes', () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  test('Should return 200 if success', async () => {
    dbMock.mockResolvedValueOnce([]);
    await request(app.server).post('/cnpj/query').expect(200);
  });
});
