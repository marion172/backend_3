import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/app.js';

const request = supertest(app);

describe('Global 404 Route Not Found Handler', function () {
  it('debe responder con 404 y formato de error ante una ruta inexistente', async function () {
    const res = await request.get('/api/ruta-que-no-existe-en-la-api');

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({
      status: 'error',
      error: 'ROUTE_NOT_FOUND',
      message: 'Route not found'
    });
  });
});
