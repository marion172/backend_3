import multer from 'multer';
import fs from 'fs';
import path from 'path';
import CustomError from '../errors/custom.error.js';
import logger from './logger.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now();
      const ext = path.extname(file.originalname);
      const uniqueBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${uniqueBaseName}-${uniqueName}${ext}`;
      cb(null, filename);
    }
  });
};

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warning(`Attempted upload with unallowed file type: ${file.mimetype}`);
    const err = new CustomError('INVALID_FILE_TYPE', `File type ${file.mimetype} is not allowed. Allowed types: JPG, PNG, PDF.`);
    cb(err, false);
  }
};

export const uploadUserDocument = multer({
  storage: createStorage('documents'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

export const uploadReceipt = multer({
  storage: createStorage('receipts'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});


export const handleUpload = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            logger.warning(`File upload error: File size limit exceeded (${err.message})`);
            return next(new CustomError('FILE_TOO_LARGE', 'File size limit exceeded. Maximum size is 5MB.'));
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            logger.warning(`File upload error: Unexpected file field '${err.field}'`);
            return next(new CustomError('INVALID_FILE_FIELD', `Unexpected file field '${err.field}'`));
          }
          logger.warning(`Multer upload error: ${err.message}`);
          return next(new CustomError('VALIDATION_ERROR', err.message));
        }
        return next(err);
      }
      next();
    });
  };
};
