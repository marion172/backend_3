import express from 'express';

import MockController from '../controllers/mock.controller.js';

const router = express.Router();

// Rutas GET para generación en memoria
router.get('/mocking-users', MockController.mockingUsers);
router.get('/mocking-orders', MockController.mockingOrders);
router.get('/generateData', MockController.generateData);

// Rutas POST para persistencia en MongoDB
router.post('/seed', MockController.seedUsers);
router.post('/seed-orders', MockController.seedOrders);
router.post('/seed-deliveries', MockController.seedDeliveries);
router.post('/seed-data', MockController.seedData);

router.post('/generate-products', MockController.generateProducts);
router.post('/generate-orders', MockController.mockingOrders);
router.post('/generateData', MockController.generateData);

export default router;