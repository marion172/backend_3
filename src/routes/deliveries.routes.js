import express from 'express';
import DeliveryController from '../controllers/delivery.controller.js';

const router = express.Router();

router.get('/', DeliveryController.getAll);
router.get('/:id', DeliveryController.getById);
router.post('/', DeliveryController.create);
router.patch('/:id', DeliveryController.update);
router.delete('/:id', DeliveryController.delete);

export default router;
