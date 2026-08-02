import express from 'express';

import MockController from '../controllers/mock.controller.js';

const router = express.Router();

router.get('/mocking-users', MockController.mockingUsers);
router.get('/mocking-orders', MockController.mockingOrders);
router.get('/generateData', MockController.generateData);

router.post('/seed', MockController.seedUsers);

router.post('/generate-products', MockController.generateProducts);

export default router;