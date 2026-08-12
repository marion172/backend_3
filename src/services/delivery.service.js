import DeliveryRepository from '../repositories/delivery.repository.js';
import CustomError from '../errors/custom.error.js';
import logger from '../config/logger.js';

class DeliveryService {
  static async getAll() {
    return await DeliveryRepository.find();
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
}

export default DeliveryService;
