import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/app.js';

const request = supertest(app);

describe('Swagger Documentation Route (/api/docs)', function () {
  it('debe responder con status 200 y servir la interfaz de Swagger UI en /api/docs/', async function () {
    const res = await request.get('/api/docs/');

    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.include('text/html');
    expect(res.text).to.include('Swagger UI');
  });

  it('debe responder con redirección o servir la ruta base /api/docs', async function () {
    const res = await request.get('/api/docs');
    expect([200, 301, 302]).to.include(res.status);
  });
});
