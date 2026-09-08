import DeliveryRepository from '../repositories/delivery.repository.js';
import CustomError from '../errors/custom.error.js';
import logger from '../config/logger.js';
import { DOCUMENT_TYPES } from '../constants/index.js';

class DeliveryService {
  static async getAll(queryParams = {}) {
    return await DeliveryRepository.find(queryParams);
  }

  static async getById(id) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      logger.warning(`Delivery #${id} no encontrado`);
      throw new CustomError('DELIVERY_NOT_FOUND');
    }
    return delivery;
  }

  static async create(deliveryData) {
    const newDelivery = await DeliveryRepository.create(deliveryData);
    logger.info(`Delivery #${newDelivery._id} created successfully`);
    return newDelivery;
  }

  static async update(id, deliveryData) {
    const existing = await DeliveryRepository.findById(id);
    if (!existing) {
      logger.warning(`Delivery #${id} not found for update`);
      throw new CustomError('DELIVERY_NOT_FOUND');
    }
    return await DeliveryRepository.update(id, deliveryData);
  }

  static async delete(id) {
    const existing = await DeliveryRepository.findById(id);
    if (!existing) {
      logger.warning(`Delivery #${id} not found for delete`);
      throw new CustomError('DELIVERY_NOT_FOUND');
    }
    return await DeliveryRepository.delete(id);
  }

  static async uploadReceipt(id, file, documentType) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      logger.warning(`Delivery #${id} not found for receipt upload`);
      throw new CustomError('DELIVERY_NOT_FOUND');
    }

    if (!file) {
      logger.warning(`Receipt upload failed for delivery #${id}: No file provided`);
      throw new CustomError('FILE_REQUIRED');
    }

    const validDocTypes = Object.values(DOCUMENT_TYPES);
    if (documentType && !validDocTypes.includes(documentType)) {
      logger.warning(`Receipt upload failed for delivery #${id}: Invalid document type '${documentType}'`);
      throw new CustomError('INVALID_DOCUMENT_TYPE');
    }

    const receiptMetadata = {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      documentType: documentType || DOCUMENT_TYPES.DELIVERY_PROOF,
      uploadedAt: new Date()
    };

    const updatedDelivery = await DeliveryRepository.addReceipt(id, receiptMetadata);
    logger.info(`Receipt '${file.filename}' associated with delivery #${id} successfully`);
    return updatedDelivery;
  }
}


export default DeliveryService;
