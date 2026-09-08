import UserRepository from '../repositories/user.repository.js';
import CustomError from '../errors/custom.error.js';
import logger from '../config/logger.js';
import { DOCUMENT_TYPES } from '../constants/index.js';

class UserService {
  static async getAll(queryParams = {}) {
    return await UserRepository.find(queryParams);
  }

  static async getById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      logger.warning(`User #${id} not found`);
      throw new CustomError('USER_NOT_FOUND');
    }
    return user;
  }

  static async create(userData) {
    const { email } = userData;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      logger.warning(`The user with email ${email} already exists`);
      throw new CustomError('USER_ALREADY_EXISTS');
    }

    const newUser = await UserRepository.create(userData);
    logger.info(`User #${newUser._id} created successfully`);
    return newUser;
  }

  static async update(id, userData) {
    const updatedUser = await UserRepository.findById(id);

    if (!updatedUser) {
      logger.warning(`User #${id} not found for update`);
      throw new CustomError('USER_NOT_FOUND');
    }

    return await UserRepository.update(id, userData);
  }

  static async delete(id) {
    const deletedUser = await UserRepository.findById(id);
    if (!deletedUser) {
      logger.warning(`User #${id} not found for delete`);
      throw new CustomError('USER_NOT_FOUND');
    }
    return await UserRepository.delete(id);
  }

  static async uploadDocument(id, file, documentType) {
    const user = await UserRepository.findById(id);
    if (!user) {
      logger.warning(`User #${id} not found for document upload`);
      throw new CustomError('USER_NOT_FOUND');
    }

    if (!file) {
      logger.warning(`Upload failed for user #${id}: No file provided`);
      throw new CustomError('FILE_REQUIRED');
    }

    const validDocTypes = Object.values(DOCUMENT_TYPES);
    if (documentType && !validDocTypes.includes(documentType)) {
      logger.warning(`Upload failed for user #${id}: Invalid document type '${documentType}'`);
      throw new CustomError('INVALID_DOCUMENT_TYPE');
    }

    const documentMetadata = {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      documentType: documentType || DOCUMENT_TYPES.IDENTIFICATION,
      uploadedAt: new Date()
    };

    const updatedUser = await UserRepository.addDocument(id, documentMetadata);
    logger.info(`Document '${file.filename}' of type '${documentMetadata.documentType}' uploaded successfully for user #${id}`);
    return updatedUser;
  }
}


export default UserService;
