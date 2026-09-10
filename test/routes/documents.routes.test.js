import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { clearDatabase } from '../index.js';
import UserModel from '../../src/models/user.model.js';
import DeliveryModel from '../../src/models/delivery.model.js';
import OrderModel from '../../src/models/order.model.js';

const request = supertest(app);

describe('Documents & File Upload Routes (/api/users/:id/documents & /api/deliveries/:id/receipt)', function () {
  let user;
  let order;
  let delivery;

  beforeEach(async function () {
    await clearDatabase();

    user = await UserModel.create({
      first_name: 'Carlos',
      last_name: 'Gomez',
      email: 'carlos.gomez@example.com',
      password: 'Password123',
      role: 'customer'
    });

    order = await OrderModel.create({
      customerId: user._id,
      items: [{ product: 'Product 1', price: 100, quantity: 1, subTotal: 100 }],
      deliveryAddress: 'Chacabuco 123',
      total: 100
    });

    delivery = await DeliveryModel.create({
      orderId: order._id,
      driverId: user._id,
      status: 'CREATED'
    });
  });

  describe('POST /api/users/:id/documents', function () {
    it('debe cargar un documento de usuario correctamente y guardar sus metadatos', async function () {
      const fileBuffer = Buffer.from('PDF test');

      const res = await request
        .post(`/api/users/${user._id}/documents`)
        .field('documentType', 'identification')
        .attach('file', fileBuffer, 'dni.pdf');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('documents');
      expect(res.body.documents).to.be.an('array').with.lengthOf(1);

      const doc = res.body.documents[0];
      expect(doc).to.have.property('originalName', 'dni.pdf');
      expect(doc).to.have.property('documentType', 'identification');
      expect(doc).to.have.property('mimetype', 'application/pdf');
      expect(doc).to.have.property('filename');
      expect(doc).to.have.property('path');
      expect(doc).to.have.property('size');
      expect(doc).to.have.property('uploadedAt');
    });

    it('debe devolver error 400 FILE_REQUIRED cuando no se envía archivo', async function () {
      const res = await request
        .post(`/api/users/${user._id}/documents`)
        .field('documentType', 'identification');

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'FILE_REQUIRED');
    });

    it('debe devolver error 400 INVALID_DOCUMENT_TYPE cuando el tipo de documento es inválido', async function () {
      const fileBuffer = Buffer.from('Text test');

      const res = await request
        .post(`/api/users/${user._id}/documents`)
        .field('documentType', 'tipo_invalido_123')
        .attach('file', fileBuffer, 'doc.png');

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'INVALID_DOCUMENT_TYPE');
    });

    it('debe devolver error 400 INVALID_FILE_TYPE cuando el formato de archivo no es permitido', async function () {
      const fileBuffer = Buffer.from('console.log("malicious code")');

      const res = await request
        .post(`/api/users/${user._id}/documents`)
        .field('documentType', 'identification')
        .attach('file', fileBuffer, 'script.exe');

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'INVALID_FILE_TYPE');
    });

    it('debe devolver error 404 USER_NOT_FOUND cuando el usuario no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId();
      const fileBuffer = Buffer.from('PDF test');

      const res = await request
        .post(`/api/users/${nonExistentId}/documents`)
        .field('documentType', 'license')
        .attach('file', fileBuffer, 'licencia.pdf');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'USER_NOT_FOUND');
    });
  });

  describe('POST /api/deliveries/:id/receipt', function () {
    it('debe cargar un comprobante de entrega correctamente y registrar sus metadatos', async function () {
      const fileBuffer = Buffer.from('Test image');

      const res = await request
        .post(`/api/deliveries/${delivery._id}/receipt`)
        .field('documentType', 'delivery_proof')
        .attach('file', fileBuffer, 'comprobante.jpg');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('receipts');
      expect(res.body.receipts).to.be.an('array').with.lengthOf(1);

      const receipt = res.body.receipts[0];
      expect(receipt).to.have.property('originalName', 'comprobante.jpg');
      expect(receipt).to.have.property('documentType', 'delivery_proof');
      expect(receipt).to.have.property('mimetype', 'image/jpeg');
      expect(receipt).to.have.property('filename');
      expect(receipt).to.have.property('path');
      expect(receipt).to.have.property('size');
      expect(receipt).to.have.property('uploadedAt');
    });

    it('debe devolver error 404 DELIVERY_NOT_FOUND cuando el delivery no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId();
      const fileBuffer = Buffer.from('Test image');

      const res = await request
        .post(`/api/deliveries/${nonExistentId}/receipt`)
        .field('documentType', 'receipt')
        .attach('file', fileBuffer, 'ticket.png');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'DELIVERY_NOT_FOUND');
    });
  });

  describe('POST /api/orders/:id/receipt', function () {
    it('debe cargar un comprobante de pedido correctamente y registrar sus metadatos', async function () {
      const fileBuffer = Buffer.from('Test receipt');

      const res = await request
        .post(`/api/orders/${order._id}/receipt`)
        .field('documentType', 'receipt')
        .attach('file', fileBuffer, 'factura.pdf');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('receipts');
      expect(res.body.receipts).to.be.an('array').with.lengthOf(1);

      const receipt = res.body.receipts[0];
      expect(receipt).to.have.property('originalName', 'factura.pdf');
      expect(receipt).to.have.property('documentType', 'receipt');
      expect(receipt).to.have.property('mimetype', 'application/pdf');
    });

    it('debe devolver error 404 ORDER_NOT_FOUND cuando el pedido no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId();
      const fileBuffer = Buffer.from('Test receipt');

      const res = await request
        .post(`/api/orders/${nonExistentId}/receipt`)
        .field('documentType', 'receipt')
        .attach('file', fileBuffer, 'factura.pdf');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'ORDER_NOT_FOUND');
    });
  });
});
