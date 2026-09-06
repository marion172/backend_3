import express from 'express';
import DeliveryController from '../controllers/delivery.controller.js';
import { uploadReceipt, handleUpload } from '../config/multer.config.js';

const router = express.Router();

router.get('/', DeliveryController.getAll);
router.get('/:id', DeliveryController.getById);
router.post('/', DeliveryController.create);
router.patch('/:id', DeliveryController.update);
router.delete('/:id', DeliveryController.delete);
router.post('/:id/receipt', handleUpload(uploadReceipt.single('file')), DeliveryController.uploadReceipt);

export default router;

