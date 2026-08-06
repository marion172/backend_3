import OrderRepository from '../repositories/order.repository.js';
import CustomError from '../errors/custom.error.js';

class OrderService {
  static async getAll() {
    return await OrderRepository.find();
  }

  static async getById(id) {
    const order = await OrderRepository.findById(id);
    if (!order) {
      throw new CustomError('ORDER_NOT_FOUND');
    }
    return order;
  }

  static async create(orderData) {
    const { customerId, items, deliveryAddress, total } = orderData;
    if (!customerId || !items || !deliveryAddress || total === undefined) {
      throw new CustomError('VALIDATION_ERROR', 'Missing required order fields');
    }

    return await OrderRepository.create(orderData);
  }

  static async update(id, orderData) {
    const existing = await OrderRepository.findById(id);
    if (!existing) {
      throw new CustomError('ORDER_NOT_FOUND');
    }
    return await OrderRepository.update(id, orderData);
  }

  static async delete(id) {
    const existing = await OrderRepository.findById(id);
    if (!existing) {
      throw new CustomError('ORDER_NOT_FOUND');
    }
    return await OrderRepository.delete(id);
  }
}

export default OrderService;
