import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { clearDatabase } from '../index.js';
import UserModel from '../../src/models/user.model.js';
import OrderModel from '../../src/models/order.model.js';
import DeliveryModel from '../../src/models/delivery.model.js';
import { ORDER_STATUS, PRIORITY_ORDERS, USER_ROLES } from '../../src/constants/index.js';

const request = supertest(app);

describe('Deliveries Routes (/api/deliveries)', function () {
  let customerUser;
  let testOrder;

  beforeEach(async function () {
    await clearDatabase();

    customerUser = await UserModel.create({
      first_name: 'Cliente',
      last_name: 'Delivery',
      email: 'cliente.delivery@example.com',
      password: 'Password123',
      role: USER_ROLES.CUSTOMER
    });

    testOrder = await OrderModel.create({
      customerId: customerUser._id,
      items: [
        { product: 'Paquete Express', price: 100, quantity: 1, subTotal: 100 }
      ],
      deliveryAddress: 'Av. Colon 500, Cordoba',
      total: 100,
      status: ORDER_STATUS.CREATED,
      priority: PRIORITY_ORDERS.NORMAL
    });
  });

  describe('GET /api/deliveries', function () {
    it('debe responder con 200 y una lista vacía si no hay entregas', async function () {
      const res = await request.get('/api/deliveries');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
    });

    it('debe responder con 200 y la lista de entregas existentes', async function () {
      await DeliveryModel.create({
        orderId: testOrder._id,
        status: ORDER_STATUS.CREATED
      });

      const res = await request.get('/api/deliveries');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('orderId', testOrder._id.toString());
      expect(res.body[0]).to.have.property('status', ORDER_STATUS.CREATED);
    });
  });

  describe('POST /api/deliveries', function () {
    it('debe crear una entrega exitosamente con status 201', async function () {
      const payload = {
        orderId: testOrder._id.toString(),
        status: ORDER_STATUS.ASSIGNED
      };

      const res = await request.post('/api/deliveries').send(payload);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('orderId', testOrder._id.toString());
      expect(res.body).to.have.property('status', ORDER_STATUS.ASSIGNED);
    });

    it('debe responder con 400 y VALIDATION_ERROR si falta el orderId', async function () {
      const res = await request.post('/api/deliveries').send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'VALIDATION_ERROR',
        message: 'Missing required delivery fields (orderId)'
      });
    });
  });

  describe('GET /api/deliveries/:id', function () {
    it('debe responder con 200 y la entrega correspondiente si el ID existe', async function () {
      const delivery = await DeliveryModel.create({
        orderId: testOrder._id,
        status: ORDER_STATUS.IN_TRANSIT
      });

      const res = await request.get(`/api/deliveries/${delivery._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id', delivery._id.toString());
      expect(res.body).to.have.property('status', ORDER_STATUS.IN_TRANSIT);
    });

    it('debe responder con 404 si el ID de entrega no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.get(`/api/deliveries/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'DELIVERY_NOT_FOUND',
        message: 'Delivery not found'
      });
    });
  });

  describe('PATCH /api/deliveries/:id', function () {
    it('debe responder con 200 y actualizar el estado de la entrega', async function () {
      const delivery = await DeliveryModel.create({
        orderId: testOrder._id,
        status: ORDER_STATUS.ASSIGNED
      });

      const res = await request.patch(`/api/deliveries/${delivery._id}`).send({
        status: ORDER_STATUS.DELIVERED
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', ORDER_STATUS.DELIVERED);
    });

    it('debe responder con 404 si se intenta actualizar una entrega inexistente', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.patch(`/api/deliveries/${nonExistentId}`).send({
        status: ORDER_STATUS.DELIVERED
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'DELIVERY_NOT_FOUND',
        message: 'Delivery not found'
      });
    });
  });

  describe('DELETE /api/deliveries/:id', function () {
    it('debe responder con 200 y eliminar la entrega', async function () {
      const delivery = await DeliveryModel.create({
        orderId: testOrder._id,
        status: ORDER_STATUS.CREATED
      });

      const res = await request.delete(`/api/deliveries/${delivery._id}`);
      expect(res.status).to.equal(200);

      const verify = await DeliveryModel.findById(delivery._id);
      expect(verify).to.be.null;
    });

    it('debe responder con 404 si se intenta eliminar una entrega inexistente', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.delete(`/api/deliveries/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'DELIVERY_NOT_FOUND',
        message: 'Delivery not found'
      });
    });
  });
});
