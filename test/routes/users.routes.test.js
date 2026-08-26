import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { clearDatabase } from '../index.js';
import UserModel from '../../src/models/user.model.js';

const request = supertest(app);

describe('Users Routes (/api/users)', function () {
  beforeEach(async function () {
    await clearDatabase();
  });

  describe('GET /api/users', function () {
    it('debe responder con 200 y una lista vacía si no hay usuarios', async function () {
      const res = await request.get('/api/users');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
    });

    it('debe responder con 200 y la lista de usuarios con sus propiedades correctas', async function () {
      await UserModel.create({
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'Password123',
        role: 'customer'
      });

      const res = await request.get('/api/users');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('first_name', 'Juan');
      expect(res.body[0]).to.have.property('last_name', 'Pérez');
      expect(res.body[0]).to.have.property('email', 'juan.perez@example.com');
      expect(res.body[0]).to.have.property('role', 'customer');
      expect(res.body[0]).to.not.have.property('password');
    });
  });

  describe('POST /api/users', function () {
    it('debe crear un usuario exitosamente con status 201 y retornar la estructura esperada', async function () {
      const newUser = {
        first_name: 'Maria',
        last_name: 'Gomez',
        email: 'maria.gomez@example.com',
        password: 'Password123',
        role: 'customer'
      };

      const res = await request.post('/api/users').send(newUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('first_name', newUser.first_name);
      expect(res.body).to.have.property('last_name', newUser.last_name);
      expect(res.body).to.have.property('email', newUser.email);
      expect(res.body).to.have.property('role', newUser.role);
    });

    it('debe responder con 400 y formato de error si faltan campos obligatorios', async function () {
      const incompleteUser = {
        first_name: 'Incompleto'
      };

      const res = await request.post('/api/users').send(incompleteUser);

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields'
      });
    });

    it('debe responder con 409 y formato de error si el email ya está registrado', async function () {
      const existingUser = {
        first_name: 'Carlos',
        last_name: 'Lopez',
        email: 'carlos.lopez@example.com',
        password: 'Password123',
        role: 'customer'
      };

      await request.post('/api/users').send(existingUser);
      const res = await request.post('/api/users').send(existingUser);

      expect(res.status).to.equal(409);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'USER_ALREADY_EXISTS',
        message: 'User already exists'
      });
    });
  });

  describe('GET /api/users/:id', function () {
    it('debe responder con 200 y el usuario correspondiente si el ID existe', async function () {
      const user = await UserModel.create({
        first_name: 'Ana',
        last_name: 'Diaz',
        email: 'ana.diaz@example.com',
        password: 'Password123',
        role: 'driver'
      });

      const res = await request.get(`/api/users/${user._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id', user._id.toString());
      expect(res.body).to.have.property('email', 'ana.diaz@example.com');
      expect(res.body).to.have.property('role', 'driver');
    });

    it('debe responder con 404 y formato de error si el ID no existe en la base de datos', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.get(`/api/users/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    });

    it('debe responder con 400 y formato de error si el ID tiene formato inválido de MongoDB', async function () {
      const res = await request.get('/api/users/id-invalido-123');

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'INVALID_ID',
        message: 'Invalid id'
      });
    });
  });

  describe('PATCH /api/users/:id', function () {
    it('debe responder con 200 y actualizar los datos del usuario', async function () {
      const user = await UserModel.create({
        first_name: 'Pedro',
        last_name: 'Ruiz',
        email: 'pedro.ruiz@example.com',
        password: 'Password123',
        role: 'customer'
      });

      const updatePayload = {
        first_name: 'Pedro Modificado',
        last_name: 'Ruiz Modificado',
        email: 'pedro.modificado@example.com',
        password: 'NewPassword123'
      };

      const res = await request.patch(`/api/users/${user._id}`).send(updatePayload);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('first_name', 'Pedro Modificado');
      expect(res.body).to.have.property('email', 'pedro.modificado@example.com');
    });

    it('debe responder con 404 si se intenta actualizar un usuario inexistente', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.patch(`/api/users/${nonExistentId}`).send({
        first_name: 'Test',
        last_name: 'Test',
        email: 'test@example.com',
        password: 'Password123'
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    });
  });

  describe('DELETE /api/users/:id', function () {
    it('debe responder con 200 y eliminar el usuario existente', async function () {
      const user = await UserModel.create({
        first_name: 'Eliminar',
        last_name: 'User',
        email: 'user123@example.com',
        password: 'Password123',
        role: 'customer'
      });

      const res = await request.delete(`/api/users/${user._id}`);
      expect(res.status).to.equal(200);

      const verify = await UserModel.findById(user._id);
      expect(verify).to.be.null;
    });

    it('debe responder con 404 si se intenta eliminar un usuario inexistente', async function () {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request.delete(`/api/users/${nonExistentId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        status: 'error',
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    });
  });
});
