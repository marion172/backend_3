import OrderRepository from '../repositories/order.repository.js';
import CustomError from '../errors/custom.error.js';
import logger from '../config/logger.js';

import { ORDER_STATUS, DOCUMENT_TYPES } from '../constants/index.js';

class OrderService {
  static async getAll(queryParams = {}) {
    return await OrderRepository.find(queryParams);
  }

  static async getById(id) {
    const order = await OrderRepository.findById(id);
    if (!order) {
      logger.warning(`Pedido #${id} not found`);
      throw new CustomError('ORDER_NOT_FOUND');
    }
    return order;
  }

  static async create(orderData) {
    const { customerId, items, deliveryAddress, total } = orderData;
    if (!customerId || !items || !deliveryAddress || total === undefined) {
      logger.warning(`Missing required order fields`);
      throw new CustomError('VALIDATION_ERROR', 'Missing required order fields');
    }

    if (orderData.status && !Object.values(ORDER_STATUS).includes(orderData.status)) {
      logger.warning(`Invalid order status: ${orderData.status}`);
      throw new CustomError('INVALID_STATE', `Invalid order status '${orderData.status}'`);
    }

    const order = await OrderRepository.create(orderData);
    logger.info(`Pedido #${order._id} created successfully`);
    return order;
  }

  static async update(id, orderData) {
    const existing = await OrderRepository.findById(id);
    if (!existing) {
      logger.warning(`Pedido #${id} not found for update`);
      throw new CustomError('ORDER_NOT_FOUND');
    }

    if (orderData.status && !Object.values(ORDER_STATUS).includes(orderData.status)) {
      logger.warning(`Invalid order status: ${orderData.status}`);
      throw new CustomError('INVALID_STATE', `Invalid order status '${orderData.status}'`);
    }

    return await OrderRepository.update(id, orderData);
  }

  static async delete(id) {
    const existing = await OrderRepository.findById(id);
    if (!existing) {
      logger.warning(`Pedido #${id} not found for delete`);
      throw new CustomError('ORDER_NOT_FOUND');
    }
    return await OrderRepository.delete(id);
  }

  static async uploadReceipt(id, file, documentType) {
    const order = await OrderRepository.findById(id);
    if (!order) {
      logger.warning(`Pedido #${id} not found for receipt upload`);
      throw new CustomError('ORDER_NOT_FOUND');
    }

    if (!file) {
      logger.warning(`Receipt upload failed for order #${id}: No file provided`);
      throw new CustomError('FILE_REQUIRED');
    }

    const validDocTypes = Object.values(DOCUMENT_TYPES);
    if (documentType && !validDocTypes.includes(documentType)) {
      logger.warning(`Receipt upload failed for order #${id}: Invalid document type '${documentType}'`);
      throw new CustomError('INVALID_DOCUMENT_TYPE');
    }

    const receiptMetadata = {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      documentType: documentType || DOCUMENT_TYPES.RECEIPT,
      uploadedAt: new Date()
    };

    const updatedOrder = await OrderRepository.addReceipt(id, receiptMetadata);
    logger.info(`Receipt '${file.filename}' associated with order #${id} successfully`);
    return updatedOrder;
  }
}

export default OrderService;
