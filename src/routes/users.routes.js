import express from 'express';
import UserController from '../controllers/user.controller.js';
import { uploadUserDocument, handleUpload } from '../config/multer.config.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/:id/documents', handleUpload(uploadUserDocument.single('file')), UserController.uploadDocument);

export default router;

