import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/app.js';
import { clearDatabase } from '../index.js';
import UserModel from '../../src/models/user.model.js';
import OrderModel from '../../src/models/order.model.js';

const request = supertest(app);

describe('Mocks Routes (/api/mocks)', function () {
  beforeEach(async function () {
    await clearDatabase();
  });

  describe('GET /api/mocks/mocking-users', function () {
    it('debe generar usuarios mock en memoria con cantidad por defecto (10) y status 200', async function () {
      const res = await request.get('/api/mocks/mocking-users');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(10);
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('first_name');
      expect(res.body[0]).to.have.property('last_name');
      expect(res.body[0]).to.have.property('email');
      expect(res.body[0]).to.have.property('role');
    });

    it('debe respetar el parámetro count para generar la cantidad indicada', async function () {
      const res = await request.get('/api/mocks/mocking-users?count=5');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(5);
    });

    it('debe responder con 400 y INVALID_MOCK_QUANTITY si el count es negativo', async function () {
      const res = await request.get('/api/mocks/mocking-users?count=-5');

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'INVALID_MOCK_QUANTITY',
        message: 'Invalid mock quantity. Must be between 1 and 100.'
      });
    });

    it('debe responder con 400 y INVALID_MOCK_QUANTITY si el count supera el límite de 100', async function () {
      const res = await request.get('/api/mocks/mocking-users?count=500');

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'INVALID_MOCK_QUANTITY',
        message: 'Invalid mock quantity. Must be between 1 and 100.'
      });
    });
  });

  describe('GET /api/mocks/mocking-orders', function () {
    it('debe generar pedidos mock en memoria con status 200', async function () {
      const res = await request.get('/api/mocks/mocking-orders?count=4');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(4);
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('customerId');
      expect(res.body[0]).to.have.property('items').that.is.an('array');
      expect(res.body[0]).to.have.property('deliveryAddress');
      expect(res.body[0]).to.have.property('total');
    });

    it('debe responder con 400 si el count de pedidos es inválido', async function () {
      const res = await request.get('/api/mocks/mocking-orders?count=0');

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'INVALID_MOCK_QUANTITY',
        message: 'Invalid mock quantity. Must be between 1 and 100.'
      });
    });
  });

  describe('GET /api/mocks/generateData', function () {
    it('debe generar un conjunto completo en memoria (users, orders, deliveries) con status 200', async function () {
      const res = await request.get('/api/mocks/generateData?users=3&orders=2');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('users').that.is.an('array').with.lengthOf(3);
      expect(res.body).to.have.property('orders').that.is.an('array').with.lengthOf(2);
      expect(res.body).to.have.property('deliveries').that.is.an('array').with.lengthOf(2);
    });

    it('debe responder con 400 si los parámetros de generateData son inválidos', async function () {
      const res = await request.get('/api/mocks/generateData?users=-3&orders=2');

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'INVALID_MOCK_QUANTITY',
        message: 'Invalid mock quantity. Must be between 1 and 100.'
      });
    });
  });

  describe('POST /api/mocks/seed', function () {
    it('debe insertar usuarios de prueba en MongoDB con status 201', async function () {
      const res = await request.post('/api/mocks/seed?count=3');

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({
        insertados: 3,
        coleccion: 'usuarios'
      });

      const countInDb = await UserModel.countDocuments();
      expect(countInDb).to.equal(3);
    });
  });

  describe('POST /api/mocks/seed-orders', function () {
    it('debe insertar pedidos de prueba en MongoDB con status 201', async function () {
      const res = await request.post('/api/mocks/seed-orders?count=2');

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({
        insertados: 2,
        coleccion: 'pedidos'
      });

      const countInDb = await OrderModel.countDocuments();
      expect(countInDb).to.equal(2);
    });
  });
});
