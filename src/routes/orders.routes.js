import express from 'express';
import OrderController from '../controllers/order.controller.js';
import { uploadReceipt, handleUpload } from '../config/multer.config.js';

const router = express.Router();

router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.post('/', OrderController.create);
router.patch('/:id', OrderController.update);
router.delete('/:id', OrderController.delete);
router.post('/:id/receipt', handleUpload(uploadReceipt.single('file')), OrderController.uploadReceipt);

export default router;
