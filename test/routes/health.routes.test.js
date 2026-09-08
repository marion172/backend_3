import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/app.js';

const request = supertest(app);

describe('Health Check Route (/health)', function () {
  it('debe responder con status 200 y la estructura del estado de salud de la API', async function () {
    const res = await request.get('/health');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status', 'UP');
    expect(res.body).to.have.property('service', 'ShipNow API');
    expect(res.body).to.have.property('environment');
    expect(res.body).to.have.property('uptime').that.is.a('number');
    expect(res.body).to.have.property('timestamp');
  });

  it('no debe exponer información sensible en el health check', async function () {
    const res = await request.get('/health');

    expect(res.body).to.not.have.property('databaseUri');
    expect(res.body).to.not.have.property('jwtSecret');
    expect(res.body).to.not.have.property('MONGODB_URI');
  });
});
