import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/app.js';

const request = supertest(app);

describe('Logger Endpoint (/api/mocks/loggerTest)', function () {
  it('debe responder con 200 y mensaje de confirmación al ejecutar la prueba de logs', async function () {
    const res = await request.get('/api/mocks/loggerTest');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      message: 'Logger test'
    });
  });
});
