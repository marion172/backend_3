import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { clearDatabase } from '../index.js';
import ProductModel from '../../src/models/product.model.js';
import { PRODUCT_STATUS } from '../../src/constants/index.js';

const request = supertest(app);

describe('Products Routes (/api/products)', function () {
  beforeEach(async function () {
    await clearDatabase();
  });

  describe('GET /api/products', function () {
    it('debe responder con 200 y una lista vacía si no hay productos', async function () {
      const res = await request.get('/api/products');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
    });

    it('debe responder con 200 y la lista de productos existentes', async function () {
      await ProductModel.create({
        name: 'Smartphone Pro',
        description: 'Celular de última generación',
        price: 999.99,
        stock: 15,
        status: PRODUCT_STATUS.AVAILABLE
      });

      const res = await request.get('/api/products');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('name', 'Smartphone Pro');
      expect(res.body[0]).to.have.property('price', 999.99);
      expect(res.body[0]).to.have.property('stock', 15);
      expect(res.body[0]).to.have.property('status', PRODUCT_STATUS.AVAILABLE);
    });
  });

  describe('POST /api/products', function () {
    it('debe crear un producto exitosamente con status 201', async function () {
      const newProduct = {
        name: 'Tablet Ultra',
        description: 'Pantalla 11 pulgadas',
        price: 450,
        stock: 20
      };

      const res = await request.post('/api/products').send(newProduct);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name', 'Tablet Ultra');
      expect(res.body).to.have.property('price', 450);
      expect(res.body).to.have.property('stock', 20);
      expect(res.body).to.have.property('status', PRODUCT_STATUS.AVAILABLE);
    });

    it('debe responder con 400 y PRODUCT_PRICE_ERROR si el precio es negativo', async function () {
      const invalidProduct = {
        name: 'Producto Precio Negativo',
        description: 'Test',
        price: -10,
        stock: 5
      };

      const res = await request.post('/api/products').send(invalidProduct);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'PRODUCT_PRICE_ERROR',
        message: 'Product price error price must be grater than 0'
      });
    });

    it('debe responder con 409 y PRODUCT_ALREADY_EXISTS si el nombre del producto ya existe', async function () {
      const product = {
        name: 'Producto Duplicado',
        description: 'Test duplicado',
        price: 100,
        stock: 10
      };

      await request.post('/api/products').send(product);
      const res = await request.post('/api/products').send(product);

      expect(res.status).to.equal(409);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'PRODUCT_ALREADY_EXISTS',
        message: 'Product already exists'
      });
    });
  });

  describe('GET /api/products/:id', function () {
    it('debe responder con 200 y el producto si el ID existe', async function () {
      const product = await ProductModel.create({
        name: 'Cámara 4K',
        description: 'Cámara para streaming',
        price: 200,
        stock: 8,
        status: PRODUCT_STATUS.AVAILABLE
      });

      const res = await request.get(`/api/products/${product._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id', product._id.toString());
      expect(res.body).to.have.property('name', 'Cámara 4K');
    });

    it('debe responder con 404 si el ID no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.get(`/api/products/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    });
  });

  describe('PATCH /api/products/:id', function () {
    it('debe responder con 200 y actualizar el producto', async function () {
      const product = await ProductModel.create({
        name: 'Mouse Básico',
        description: 'Mouse óptico',
        price: 15,
        stock: 50,
        status: PRODUCT_STATUS.AVAILABLE
      });

      const res = await request.patch(`/api/products/${product._id}`).send({
        name: 'Mouse Básico Actualizado',
        description: 'Mouse óptico v2',
        price: 20,
        stock: 30
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Mouse Básico Actualizado');
      expect(res.body).to.have.property('price', 20);
    });

    it('debe responder con 404 si el producto a actualizar no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.patch(`/api/products/${nonExistentId}`).send({
        name: 'No existe',
        description: 'Test',
        price: 50,
        stock: 10
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    });
  });

  describe('DELETE /api/products/:id', function () {
    it('debe responder con 200 y eliminar el producto', async function () {
      const product = await ProductModel.create({
        name: 'Para Eliminar',
        description: 'Test',
        price: 30,
        stock: 5,
        status: PRODUCT_STATUS.AVAILABLE
      });

      const res = await request.delete(`/api/products/${product._id}`);
      expect(res.status).to.equal(200);

      const check = await ProductModel.findById(product._id);
      expect(check).to.be.null;
    });

    it('debe responder con 404 si el producto a eliminar no existe', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.delete(`/api/products/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    });
  });
});
