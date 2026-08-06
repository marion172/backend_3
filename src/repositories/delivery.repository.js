import DeliveryModel from '../models/delivery.model.js';

class DeliveryRepository {
  static async find() {
    return await DeliveryModel.find();
  }

  static async findById(id) {
    return await DeliveryModel.findById(id);
  }

  static async create(deliveryData) {
    const delivery = new DeliveryModel(deliveryData);
    return await delivery.save();
  }

  static async update(id, deliveryData) {
    return await DeliveryModel.findByIdAndUpdate(id, deliveryData, { returnDocument: 'after', runValidators: true });
  }

  static async delete(id) {
    return await DeliveryModel.findByIdAndDelete(id);
  }

  static async insertMany(deliveriesData) {
    return await DeliveryModel.insertMany(deliveriesData);
  }
}

export default DeliveryRepository;
