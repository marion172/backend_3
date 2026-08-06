import DeliveryRepository from '../repositories/delivery.repository.js';
import CustomError from '../errors/custom.error.js';

class DeliveryService {
  static async getAll() {
    return await DeliveryRepository.find();
  }

  static async getById(id) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      throw new CustomError('DELIVERY_NOT_FOUND');
    }
    return delivery;
  }

  static async create(deliveryData) {
    return await DeliveryRepository.create(deliveryData);
  }

  static async update(id, deliveryData) {
    const existing = await DeliveryRepository.findById(id);
    if (!existing) {
      throw new CustomError('DELIVERY_NOT_FOUND');
    }
    return await DeliveryRepository.update(id, deliveryData);
  }

  static async delete(id) {
    const existing = await DeliveryRepository.findById(id);
    if (!existing) {
      throw new CustomError('DELIVERY_NOT_FOUND');
    }
    return await DeliveryRepository.delete(id);
  }
}

export default DeliveryService;
