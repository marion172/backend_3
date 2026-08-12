import OrderRepository from '../repositories/order.repository.js';
import CustomError from '../errors/custom.error.js';
import logger from '../config/logger.js';

class OrderService {
  static async getAll() {
    return await OrderRepository.find();
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
}

export default OrderService;
