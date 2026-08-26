import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { clearDatabase } from '../index.js';
import UserModel from '../../src/models/user.model.js';
import OrderModel from '../../src/models/order.model.js';
import { ORDER_STATUS, PRIORITY_ORDERS, USER_ROLES } from '../../src/constants/index.js';

const request = supertest(app);

describe('Orders Routes (/api/orders)', function () {
  let customerUser;

  beforeEach(async function () {
    await clearDatabase();

    customerUser = await UserModel.create({
      first_name: 'Cliente',
      last_name: 'Prueba',
      email: 'cliente.prueba@example.com',
      password: 'Password123',
      role: USER_ROLES.CUSTOMER
    });
  });

  describe('GET /api/orders', function () {
    it('debe responder con 200 y una lista vacía si no hay pedidos', async function () {
      const res = await request.get('/api/orders');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
    });

    it('debe responder con 200 y la lista de pedidos con sus propiedades', async function () {
      await OrderModel.create({
        customerId: customerUser._id,
        items: [
          { product: 'Laptop Gamer', price: 1200, quantity: 1, subTotal: 1200 }
        ],
        deliveryAddress: 'Maipu 1234, Cordoba',
        total: 1200,
        status: ORDER_STATUS.CREATED,
        priority: PRIORITY_ORDERS.NORMAL
      });

      const res = await request.get('/api/orders');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('customerId', customerUser._id.toString());
      expect(res.body[0]).to.have.property('total', 1200);
      expect(res.body[0]).to.have.property('deliveryAddress', 'Maipu 1234, Cordoba');
      expect(res.body[0]).to.have.property('items').that.is.an('array').with.lengthOf(1);
      expect(res.body[0]).to.have.property('status', ORDER_STATUS.CREATED);
      expect(res.body[0]).to.have.property('priority', PRIORITY_ORDERS.NORMAL);
    });
  });

  describe('POST /api/orders', function () {
    it('debe crear un pedido exitosamente con status 201 y retornar la estructura esperada', async function () {
      const orderPayload = {
        customerId: customerUser._id.toString(),
        items: [
          { product: 'Mouse Inalámbrico', price: 25, quantity: 2, subTotal: 50 },
          { product: 'Teclado Mecánico', price: 80, quantity: 1, subTotal: 80 }
        ],
        deliveryAddress: 'Maipu 123, Cordoba',
        total: 130,
        status: ORDER_STATUS.CREATED,
        priority: PRIORITY_ORDERS.URGENT
      };

      const res = await request.post('/api/orders').send(orderPayload);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('customerId', customerUser._id.toString());
      expect(res.body).to.have.property('total', 130);
      expect(res.body).to.have.property('deliveryAddress', 'Maipu 123, Cordoba');
      expect(res.body).to.have.property('items').that.is.an('array').with.lengthOf(2);
      expect(res.body).to.have.property('status', ORDER_STATUS.CREATED);
      expect(res.body).to.have.property('priority', PRIORITY_ORDERS.URGENT);
    });

    it('debe responder con 400 y formato de error si faltan campos obligatorios', async function () {
      const invalidOrder = {
        customerId: customerUser._id.toString()
      };

      const res = await request.post('/api/orders').send(invalidOrder);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'VALIDATION_ERROR',
        message: 'Missing required order fields'
      });
    });
  });

  describe('GET /api/orders/:id', function () {
    it('debe responder con 200 y el pedido correspondiente si el ID existe', async function () {
      const order = await OrderModel.create({
        customerId: customerUser._id,
        items: [
          { product: 'Monitor 27 pulgadas', price: 300, quantity: 1, subTotal: 300 }
        ],
        deliveryAddress: 'Rio negro 1234, Cordoba',
        total: 300,
        status: ORDER_STATUS.PICKED_UP
      });

      const res = await request.get(`/api/orders/${order._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id', order._id.toString());
      expect(res.body).to.have.property('total', 300);
      expect(res.body).to.have.property('status', ORDER_STATUS.PICKED_UP);
    });

    it('debe responder con 404 y formato de error si el ID de pedido no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.get(`/api/orders/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'ORDER_NOT_FOUND',
        message: 'Order not found'
      });
    });

    it('debe responder con 400 y formato de error si el ID tiene formato inválido', async function () {
      const res = await request.get('/api/orders/order-invalido-999');

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'INVALID_ID',
        message: 'Invalid id'
      });
    });
  });

  describe('PATCH /api/orders/:id', function () {
    it('debe responder con 200 y actualizar el estado o datos del pedido', async function () {
      const order = await OrderModel.create({
        customerId: customerUser._id,
        items: [
          { product: 'Auriculares', price: 50, quantity: 1, subTotal: 50 }
        ],
        deliveryAddress: 'Sante fe 1234, Cordoba',
        total: 50,
        status: ORDER_STATUS.CREATED
      });

      const res = await request.patch(`/api/orders/${order._id}`).send({
        status: ORDER_STATUS.DELIVERED,
        deliveryAddress: 'Independencia 1234'
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', ORDER_STATUS.DELIVERED);
      expect(res.body).to.have.property('deliveryAddress', 'Independencia 1234');
    });

    it('debe responder con 404 si se intenta actualizar un pedido inexistente', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.patch(`/api/orders/${nonExistentId}`).send({
        status: ORDER_STATUS.DELIVERED
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'ORDER_NOT_FOUND',
        message: 'Order not found'
      });
    });
  });

  describe('DELETE /api/orders/:id', function () {
    it('debe responder con 200 y eliminar el pedido', async function () {
      const order = await OrderModel.create({
        customerId: customerUser._id,
        items: [
          { product: 'Cable HDMI', price: 10, quantity: 1, subTotal: 10 }
        ],
        deliveryAddress: 'Santa fe 123, Cordoba',
        total: 10
      });

      const res = await request.delete(`/api/orders/${order._id}`);
      expect(res.status).to.equal(200);

      const verify = await OrderModel.findById(order._id);
      expect(verify).to.be.null;
    });

    it('debe responder con 404 si se intenta eliminar un pedido inexistente', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.delete(`/api/orders/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'ORDER_NOT_FOUND',
        message: 'Order not found'
      });
    });
  });
});
